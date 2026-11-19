/**
 * Client-side mirrors of the NestJS rules for instant feedback:
 * backend/src/reservations/reservation-rules.ts and backend/src/inquiries/inquiry-rules.ts.
 * The server stays authoritative (it also checks confirmed opening hours).
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MESSAGE_MAX = 1500;
export const REQUESTS_MAX = 600;

function emailError(v: string) {
  if (!v.trim()) return 'Please enter your email address.';
  if (!EMAIL_RE.test(v.trim()) || v.trim().length > 160) return 'Enter an email address like name@example.com.';
  return '';
}

/* ---------- reservation inquiry ---------- */

export interface ReservationForm { guests: string; date: string; time: string; name: string; email: string; phone: string; requests: string; website: string }
export const RESERVATION_ORDER: (keyof ReservationForm)[] = ['guests', 'date', 'time', 'name', 'email', 'phone', 'requests'];
export const RESERVATION_LABELS: Record<keyof ReservationForm, string> = {
  guests: 'Number of guests', date: 'Preferred date', time: 'Preferred time', name: 'Full name', email: 'Email address', phone: 'Phone number', requests: 'Special requests', website: 'Website',
};

/** Today's date as YYYY-MM-DD in the visitor's calendar. */
export function todayIso(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function validateReservation(f: ReservationForm, opts: { today: string; maxGuests?: number }) {
  const e: Partial<Record<keyof ReservationForm, string>> = {};
  const max = opts.maxGuests ?? 20;
  const g = Number(f.guests.trim());
  if (!Number.isInteger(g) || g < 1 || g > max) e.guests = `Choose the number of guests (1 to ${max}).`;
  const date = f.date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(`${date}T12:00:00Z`).getTime())) e.date = 'Choose a preferred date.';
  else if (date < opts.today) e.date = 'Choose a date from today onwards.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(f.time.trim().slice(0, 5))) e.time = 'Choose a preferred time.';
  if (f.name.trim().length < 2) e.name = 'Please enter your full name.';
  else if (f.name.trim().length > 120) e.name = 'Please keep your name under 120 characters.';
  const em = emailError(f.email);
  if (em) e.email = em;
  const d = f.phone.trim().replace(/\D/g, '');
  if (!f.phone.trim()) e.phone = 'Please enter a phone number so our team can reach you.';
  else if (d.length < 10 || d.length > 15) e.phone = 'Enter a phone number with 10 to 15 digits.';
  if (f.requests.trim().length > REQUESTS_MAX) e.requests = 'Please keep special requests under 600 characters.';
  return e;
}

/* ---------- contact message ---------- */

export interface ContactForm { name: string; email: string; subject: string; message: string; website: string }
export const CONTACT_ORDER: (keyof ContactForm)[] = ['name', 'email', 'subject', 'message'];
export const CONTACT_LABELS: Record<keyof ContactForm, string> = { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message', website: 'Website' };

export function validateContact(f: ContactForm) {
  const e: Partial<Record<keyof ContactForm, string>> = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your name.';
  else if (f.name.trim().length > 120) e.name = 'Please keep your name under 120 characters.';
  const em = emailError(f.email);
  if (em) e.email = em;
  if (f.subject.trim().length < 2) e.subject = 'Please add a short subject.';
  else if (f.subject.trim().length > 140) e.subject = 'Please keep the subject under 140 characters.';
  if (f.message.trim().length < 10) e.message = 'Please write a short message (at least 10 characters).';
  else if (f.message.trim().length > MESSAGE_MAX) e.message = 'Please keep your message under 1,500 characters.';
  return e;
}
