/**
 * Pure validation for the reservation inquiry form (no Nest/TypeORM imports, so it can be unit-tested directly).
 * Messages mirror the design (design-source/Reservations.dc.html) and frontend/lib/validation.ts exactly.
 * Opening-hours checks (only once hours are confirmed) happen in ReservationsService.
 */
import { emailError, str } from '../inquiries/inquiry-rules';

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function phoneError(phone: string, required: boolean) {
  const d = phone.replace(/\D/g, '');
  if (!phone) return required ? 'Please enter a phone number so our team can reach you.' : '';
  if (d.length < 10 || d.length > 15) return 'Enter a phone number with 10 to 15 digits.';
  return '';
}

export interface ReservationInput { guests?: unknown; date?: unknown; time?: unknown; name?: unknown; email?: unknown; phone?: unknown; requests?: unknown }

export function validateReservation(dto: ReservationInput, opts: { today: string; maxGuests?: number }) {
  const e: Record<string, string> = {};
  const max = opts.maxGuests ?? 20;
  const guests = Number(str(dto.guests).trim());
  const date = str(dto.date).trim();
  const time = str(dto.time).trim().slice(0, 5);
  const name = str(dto.name).trim();
  const email = str(dto.email).trim();
  const phone = str(dto.phone).trim();
  const requests = str(dto.requests).trim();

  if (!Number.isInteger(guests) || guests < 1 || guests > max) e.guests = `Choose the number of guests (1 to ${max}).`;
  if (!date) e.date = 'Choose a preferred date.';
  else if (!DATE_RE.test(date) || isNaN(new Date(`${date}T12:00:00Z`).getTime())) e.date = 'Choose a preferred date.';
  else if (date < opts.today) e.date = 'Choose a date from today onwards.';
  if (!time || !TIME_RE.test(time)) e.time = 'Choose a preferred time.';
  if (name.length < 2) e.name = 'Please enter your full name.';
  else if (name.length > 120) e.name = 'Please keep your name under 120 characters.';
  const em = emailError(email);
  if (em) e.email = em;
  const ph = phoneError(phone, true);
  if (ph) e.phone = ph;
  if (requests.length > 600) e.requests = 'Please keep special requests under 600 characters.';

  return { errors: e, clean: { guests, date, time, name, email, phone, requests: requests || null } };
}
