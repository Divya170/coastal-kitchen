'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { dateText, timeText } from '@/lib/api';
import type { ReservationReceipt, SiteSettings } from '@/lib/types';
import { RESERVATION_LABELS, RESERVATION_ORDER, type ReservationForm as RF, todayIso, validateReservation } from '@/lib/validation';
import { Em } from './Em';
import { Icon } from './Icons';
import { FieldError, useInquiryForm } from './useInquiryForm';

const INITIAL: RF = { guests: '2', date: '', time: '', name: '', email: '', phone: '', requests: '', website: '' };

/**
 * Reservation INQUIRY form. Posts to /api/reservations; the success screen says the request is received and
 * awaiting confirmation (never "booked"). Server errors (including closed days once hours are confirmed) land
 * on the matching field.
 */
export function ReservationForm({ settings, eyebrow, title, notice }: { settings: SiteSettings; eyebrow: string; title: string; notice: string }) {
  const [today, setToday] = useState('');
  useEffect(() => setToday(todayIso()), []);
  const max = settings.maxGuests || 20;
  const form = useInquiryForm<RF, ReservationReceipt>({
    initial: INITIAL, order: RESERVATION_ORDER, endpoint: '/reservations',
    validate: (f) => validateReservation(f, { today: today || todayIso(), maxGuests: max }),
    toBody: ({ website, ...rest }) => ({ ...rest, guests: Number(rest.guests), website }),
  });
  const { f, set, errFor, bad, status, message, receipt, fieldProps } = form;
  const okRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (status === 'success') okRef.current?.focus(); }, [status]);

  const g = Math.max(1, Math.min(max, parseInt(f.guests, 10) || 0));
  const guestsText = (n: number) => (n === 1 ? '1 guest' : `${n} guests`);
  const mailto = () => {
    const subj = `Reservation inquiry · ${f.guests} guests · ${f.date ? dateText(f.date) : '?'} · ${f.time ? timeText(f.time) : '?'}`;
    const body = `Reservation inquiry (not a confirmed booking)\n\nGuests: ${f.guests}\nDate: ${f.date ? dateText(f.date) : ''}\nTime: ${f.time ? timeText(f.time) : ''}\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}${f.requests ? `\n\nSpecial requests: ${f.requests}` : ''}`;
    return `mailto:${settings.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  };

  if (status === 'success' && receipt) {
    const first = receipt.name.trim().split(/\s+/)[0] || 'there';
    return (
      <div role="status" style={{ animation: 'rise .45s ease both' }}>
        <span className="ok-badge"><Icon name="check" size={30} sw={1.8} /></span>
        <h2 ref={okRef} tabIndex={-1} className="disp" style={{ fontSize: 'clamp(34px, 3.4vw, 52px)', marginTop: 22, outline: 'none' }}>Inquiry received. <em>Awaiting confirmation.</em></h2>
        <p className="lead" style={{ marginTop: 14 }}>Thank you, {first}. <strong>Your table is not booked yet.</strong> Our team will review your request and contact you at <strong>{receipt.email}</strong> or by phone to confirm.</p>
        <dl className="sum">
          <div><dt>Guests</dt><dd>{guestsText(receipt.guests)}</dd></div>
          <div><dt>Date</dt><dd>{dateText(receipt.date)}</dd></div>
          <div><dt>Time</dt><dd>{timeText(receipt.time)}</dd></div>
          <div><dt>Reference</dt><dd>{receipt.reference}</dd></div>
        </dl>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 30 }}>
          <Link className="btn" href="/menu">Explore the Menu <span className="arr" aria-hidden="true">→</span></Link>
          <button type="button" className="btn btn-ghost" onClick={form.reset}>Send Another Inquiry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 26 }}>
        <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="h2" style={{ fontSize: 'clamp(32px, 3vw, 46px)' }}><Em text={title} /></h2></div>
        <p className="hint" style={{ fontSize: 13.5 }}><span className="req" aria-hidden="true">*</span> Required</p>
      </div>
      {notice && <p className="notice" style={{ marginBottom: 26, display: 'flex', gap: 12, alignItems: 'flex-start' }}><span style={{ color: '#174A5B', flex: 'none', marginTop: 2 }}><Icon name="calendar" size={20} sw={1.6} /></span><span>{notice}</span></p>}
      {form.submitted && bad.length > 0 && status !== 'sending' && (
        <div ref={form.summaryRef} tabIndex={-1} className="notice notice-err" role="alert" style={{ marginBottom: 24, outline: 'none' }}>
          <strong>{bad.length === 1 ? 'Please check 1 field: ' : `Please check ${bad.length} fields: `}</strong>
          {bad.map((k, i) => <span key={String(k)}>{i ? ', ' : ''}<a href={`#fld-${String(k)}`} style={{ color: '#A33A2E', fontWeight: 700 }}>{RESERVATION_LABELS[k]}</a></span>)}.
        </div>
      )}
      <form noValidate onSubmit={form.onSubmit} aria-describedby="res-note">
        <fieldset className="fs">
          <legend><span aria-hidden="true">1</span>Your table</legend>
          <div className="form-2">
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <span className="flabel" id="guests-l">Number of guests <span className="req" aria-hidden="true">*</span></span>
              <div className="stepper" data-invalid={errFor('guests') ? 'true' : 'false'}>
                <button type="button" onClick={() => set({ guests: String(Math.max(1, g - 1)) })} disabled={g <= 1} aria-label="Remove a guest"><Icon name="minus" size={18} sw={1.8} /></button>
                <input {...fieldProps('guests', true)} type="number" inputMode="numeric" min={1} max={max} aria-labelledby="guests-l" aria-required="true" />
                <button type="button" onClick={() => set({ guests: String(Math.min(max, (parseInt(f.guests, 10) || 0) + 1)) })} disabled={g >= max} aria-label="Add a guest"><Icon name="plus" size={18} sw={1.8} /></button>
              </div>
              <p id="guests-hint" className="hint" style={{ fontSize: 13.5 }}>{guestsText(parseInt(f.guests, 10) || 0)}. Larger party than {max}? Call us, or add the details under special requests.</p>
              <FieldError id="guests-err" msg={errFor('guests')} />
            </div>
            <div className="field">
              <label htmlFor="fld-date">Preferred date <span className="req" aria-hidden="true">*</span></label>
              <input {...fieldProps('date')} className="input" type="date" min={today || undefined} aria-required="true" />
              <FieldError id="date-err" msg={errFor('date')} />
            </div>
            <div className="field">
              <label htmlFor="fld-time">Preferred time <span className="req" aria-hidden="true">*</span></label>
              <input {...fieldProps('time', true)} className="input" type="time" step={900} aria-required="true" />
              <p id="time-hint" className="hint" style={{ fontSize: 13.5 }}>{settings.hoursVerified ? 'Our team will confirm the closest available time.' : 'Opening hours are still to be confirmed. Our team will confirm what’s available.'}</p>
              <FieldError id="time-err" msg={errFor('time')} />
            </div>
          </div>
        </fieldset>
        <fieldset className="fs">
          <legend><span aria-hidden="true">2</span>Your details</legend>
          <div className="form-2">
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="fld-name">Full name <span className="req" aria-hidden="true">*</span></label>
              <input {...fieldProps('name')} className="input" type="text" autoComplete="name" maxLength={120} aria-required="true" />
              <FieldError id="name-err" msg={errFor('name')} />
            </div>
            <div className="field">
              <label htmlFor="fld-email">Email address <span className="req" aria-hidden="true">*</span></label>
              <input {...fieldProps('email')} className="input" type="email" autoComplete="email" inputMode="email" maxLength={160} aria-required="true" />
              <FieldError id="email-err" msg={errFor('email')} />
            </div>
            <div className="field">
              <label htmlFor="fld-phone">Phone number <span className="req" aria-hidden="true">*</span></label>
              <input {...fieldProps('phone', true)} className="input" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} aria-required="true" />
              <p id="phone-hint" className="hint" style={{ fontSize: 13.5 }}>So our team can reach you to confirm.</p>
              <FieldError id="phone-err" msg={errFor('phone')} />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="fld-requests">Special requests <span className="opt">(optional)</span></label>
              <textarea {...fieldProps('requests', true)} className="input" rows={4} maxLength={700} placeholder="An occasion, dietary needs, accessibility, a high chair…" />
              <p id="requests-hint" className="hint" style={{ fontSize: 13, textAlign: 'right' }}>{f.requests.length} / 600</p>
              <FieldError id="requests-err" msg={errFor('requests')} />
            </div>
          </div>
        </fieldset>
        <div className="sr" aria-hidden="true"><label htmlFor="fld-website">Website</label><input id="fld-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set({ website: e.target.value })} /></div>

        {status === 'failure' && (
          <div className="notice notice-err" role="alert" style={{ marginTop: 28 }}>
            <p style={{ fontWeight: 800, color: '#A33A2E' }}>Your inquiry couldn’t be sent.</p>
            <p style={{ marginTop: 6 }}>{message || 'Your details are still here. Please try again'}{settings.phoneHref && <>, call <a href={settings.phoneHref}>{settings.phone}</a></>}{settings.email && <>, or <a href={mailto()}>send it by email</a></>}.</p>
            {settings.email && <a className="btn btn-ghost" href={mailto()} style={{ marginTop: 14, minHeight: 48 }}>Open This in Your Email <span className="arr" aria-hidden="true">→</span></a>}
          </div>
        )}
        {status === 'duplicate' && (
          <div className="notice notice-warn" role="status" style={{ marginTop: 28 }}>
            <p style={{ fontWeight: 800 }}>Already received.</p>
            <p style={{ marginTop: 6 }}>{message}</p>
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginTop: 30 }}>
          <button type="submit" className="btn btn-coral" aria-busy={form.sending} disabled={form.sending} style={{ minWidth: 280 }}>
            {form.sending ? <><span className="spinner" aria-hidden="true" />Sending…</> : <>Submit Reservation Inquiry <Icon name="send" size={17} sw={1.7} /></>}
          </button>
          <p id="res-note" className="hint" style={{ fontSize: 13.5, maxWidth: 320 }}>Your details are used only to reply about this reservation.</p>
        </div>
        <p className="sr" aria-live="polite">{form.sending ? 'Sending your reservation inquiry…' : ''}</p>
      </form>
    </>
  );
}
