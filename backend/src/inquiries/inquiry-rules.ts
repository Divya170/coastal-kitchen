/**
 * Pure validation for the Contact form (no Nest/TypeORM imports, so it can be unit-tested directly).
 * Rules and messages mirror the design (design-source/Contact.dc.html) and frontend/lib/validation.ts.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export function emailError(email: string) {
  if (!email) return 'Please enter your email address.';
  if (!EMAIL_RE.test(email) || email.length > 160) return 'Enter an email address like name@example.com.';
  return '';
}

export interface InquiryInput { name?: unknown; email?: unknown; subject?: unknown; message?: unknown }

export function validateInquiry(dto: InquiryInput) {
  const e: Record<string, string> = {};
  const name = str(dto.name).trim();
  const email = str(dto.email).trim();
  const subject = str(dto.subject).trim();
  const message = str(dto.message).trim();

  if (name.length < 2) e.name = 'Please enter your name.';
  else if (name.length > 120) e.name = 'Please keep your name under 120 characters.';
  const em = emailError(email);
  if (em) e.email = em;
  if (subject.length < 2) e.subject = 'Please add a short subject.';
  else if (subject.length > 140) e.subject = 'Please keep the subject under 140 characters.';
  if (message.length < 10) e.message = 'Please write a short message (at least 10 characters).';
  else if (message.length > 1500) e.message = 'Please keep your message under 1,500 characters.';

  return { errors: e, clean: { name, email, subject, message } };
}
