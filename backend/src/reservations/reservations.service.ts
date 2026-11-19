import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateLimiter, fingerprintOf, makeReference, toCsv } from '../common/rate-limit';
import { fieldErrors } from '../common/validation';
import { DAYS } from '../settings/days';
import { fmt12 } from '../settings/hours';
import { SettingsService } from '../settings/settings.service';
import { CreateReservationDto, ListReservationsQuery, UpdateReservationDto } from './dto/reservation.dto';
import { RESERVATION_STATUSES, Reservation } from './reservation.entity';
import { validateReservation } from './reservation-rules';

const DUPLICATE_WINDOW_MS = 10 * 60_000;
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/** Today's date (YYYY-MM-DD) in the restaurant's timezone. */
export function todayIn(timeZone: string, d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

@Injectable()
export class ReservationsService {
  private readonly limiter: RateLimiter;

  constructor(
    @InjectRepository(Reservation) private readonly repo: Repository<Reservation>,
    private readonly settings: SettingsService,
    config: ConfigService,
  ) {
    this.limiter = new RateLimiter(() => Number(config.get('RESERVATION_RATE_LIMIT')) || 5,
      'You’ve sent several reservation inquiries in a short time. Please wait a few minutes, or call the restaurant.');
  }

  private async newReference() {
    for (;;) {
      const ref = makeReference('CK');
      if ((await this.repo.count({ where: { reference: ref } })) === 0) return ref;
    }
  }

  /** Only once the restaurant has confirmed its hours: refuse closed days and times outside opening hours. */
  private hoursErrors(date: string, time: string, s: Awaited<ReturnType<SettingsService['get']>>) {
    if (!s.hoursVerified) return {};
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay(); // 0 = Sunday
    const day = DAYS[(weekday + 6) % 7];
    const h = s.hours.find((x) => x.day === day);
    if (!h || h.closed || !h.open || !h.close) return { date: `We’re closed on ${day}s. Please choose another date.` };
    const o = toMin(h.open);
    let c = toMin(h.close);
    let t = toMin(time);
    if (c <= o) { c += 1440; if (t < o) t += 1440; }
    if (t < o || t >= c) return { time: `Please choose a time between ${fmt12(h.open)} and ${fmt12(h.close)}.` };
    return {};
  }

  async create(dto: CreateReservationDto, ip: string) {
    if (String(dto.website ?? '').trim()) throw new HttpException({ statusCode: 400, message: 'Your inquiry could not be sent.' }, HttpStatus.BAD_REQUEST);

    const s = await this.settings.get();
    const { errors, clean } = validateReservation(dto, { today: todayIn(this.settings.timeZone()), maxGuests: s.maxGuests });
    if (!errors.date && !errors.time) Object.assign(errors, this.hoursErrors(clean.date, clean.time, s));
    if (Object.keys(errors).length) {
      const n = Object.keys(errors).length;
      throw fieldErrors(errors, n === 1 ? 'Please check 1 field before sending.' : `Please check ${n} fields before sending.`);
    }

    const fingerprint = fingerprintOf([clean.email, clean.date, clean.time, clean.guests, clean.name]);
    const last = await this.repo.findOne({ where: { fingerprint }, order: { createdAt: 'DESC' } });
    if (last && Date.now() - new Date(last.createdAt).getTime() < DUPLICATE_WINDOW_MS) {
      throw new ConflictException({ statusCode: 409, message: 'We already have this reservation inquiry, so it wasn’t sent again. Our team will be in touch to confirm.' });
    }

    this.limiter.check(ip);
    const saved = await this.repo.save(this.repo.create({ ...clean, fingerprint, status: 'new', reference: await this.newReference() }));
    // Deliberately "received", never "confirmed": the team confirms with the guest directly.
    return {
      received: true, status: 'awaiting_confirmation', reference: saved.reference,
      name: saved.name, email: saved.email, guests: saved.guests, date: saved.date, time: saved.time, createdAt: saved.createdAt,
    };
  }

  async list(q: ListReservationsQuery) {
    const page = Math.max(1, parseInt(q.page || '1', 10) || 1);
    const pageSize = Math.min(100000, Math.max(5, parseInt(q.pageSize || '20', 10) || 20));
    const today = todayIn(this.settings.timeZone());
    const qb = this.repo.createQueryBuilder('r');
    if (q.status && q.status !== 'all') qb.andWhere('r.status = :status', { status: q.status });
    if (q.when === 'upcoming') qb.andWhere('r.date >= :today', { today });
    if (q.when === 'past') qb.andWhere('r.date < :today', { today });
    if (q.when === 'today') qb.andWhere('r.date = :today', { today });
    if (q.from && /^\d{4}-\d{2}-\d{2}$/.test(q.from)) qb.andWhere('r.date >= :from', { from: q.from });
    if (q.to && /^\d{4}-\d{2}-\d{2}$/.test(q.to)) qb.andWhere('r.date <= :to', { to: q.to });
    if (q.search?.trim()) {
      qb.andWhere('(LOWER(r.name) LIKE :s OR LOWER(r.email) LIKE :s OR r.phone LIKE :s OR LOWER(r.reference) LIKE :s OR LOWER(r.requests) LIKE :s)', { s: `%${q.search.trim().toLowerCase()}%` });
    }
    if (q.sort === 'date') qb.orderBy('r.date', 'ASC').addOrderBy('r.time', 'ASC');
    else qb.orderBy('r.createdAt', q.sort === 'oldest' ? 'ASC' : 'DESC').addOrderBy('r.id', q.sort === 'oldest' ? 'ASC' : 'DESC');
    qb.skip((page - 1) * pageSize).take(pageSize);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)), today };
  }

  async stats() {
    const today = todayIn(this.settings.timeZone());
    const rows = await this.repo.createQueryBuilder('r').select('r.status', 'status').addSelect('COUNT(*)', 'count').groupBy('r.status').getRawMany<{ status: string; count: string }>();
    const by = Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
    const upcoming = await this.repo.createQueryBuilder('r').where('r.date >= :today', { today }).andWhere("r.status IN ('new','confirmed')").getCount();
    const todayCount = await this.repo.createQueryBuilder('r').where('r.date = :today', { today }).andWhere("r.status IN ('new','confirmed')").getCount();
    const next = await this.repo.createQueryBuilder('r').where('r.date >= :today', { today }).andWhere("r.status = 'new'").orderBy('r.date', 'ASC').addOrderBy('r.time', 'ASC').take(5).getMany();
    return { ...Object.fromEntries(RESERVATION_STATUSES.map((s) => [s, by[s] ?? 0])), total: rows.reduce((a, r) => a + Number(r.count), 0), upcoming, today: todayCount, nextToConfirm: next };
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Reservation inquiry not found.');
    return row;
  }

  async update(id: number, dto: UpdateReservationDto) {
    const row = await this.findOne(id);
    if (dto.status) row.status = dto.status;
    if (dto.adminNotes !== undefined) row.adminNotes = dto.adminNotes?.trim() || null;
    return this.repo.save(row);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
    return { ok: true };
  }

  async exportCsv(q: ListReservationsQuery) {
    const { items } = await this.list({ ...q, page: '1', pageSize: '100000' });
    return toCsv(items, ['reference', 'status', 'date', 'time', 'guests', 'name', 'phone', 'email', 'requests', 'createdAt', 'adminNotes']);
  }
}
