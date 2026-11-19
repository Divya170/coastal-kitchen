'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { InquiryReceipt, SiteSettings } from '@/lib/types';
import { CONTACT_LABELS, CONTACT_ORDER, type ContactForm as CF, validateContact } from '@/lib/validation';
import { Icon } from './Icons';
import { FieldError, useInquiryForm } from './useInquiryForm';

const INITIAL: CF = { name: '', email: '', subject: '', message: '', website: '' };

/** Contact page message form (Name, Email, Subject, Message). Success only after the API stores it. */
export function ContactForm({ settings }: { settings: SiteSettings }) {
  const form = useInquiryForm<CF, InquiryReceipt>({ initial: INITIAL, order: CONTACT_ORDER, endpoint: '/inquiries', validate: validateContact, toBody: (f) => f });
  const { f, errFor, bad, status, message, receipt, fieldProps } = form;
  const okRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (status === 'success') okRef.current?.focus(); }, [status]);
  const mailto = `mailto:${settings.email}?subject=${encodeURIComponent(f.subject || `Hello ${settings.businessName}`)}&body=${encodeURIComponent(`${f.message}\n\n${f.name}`)}`;

  if (status === 'success' && receipt) {
    const first = receipt.name.trim().split(/\s+/)[0] || 'there';
    return (
      <div role="status" className="notice" style={{ padding: 'clamp(24px, 3vw, 40px)', animation: 'rise .45s ease both' }}>
        <span className="ok-badge" style={{ width: 60, height: 60 }}><Icon name="check" size={28} sw={1.8} /></span>
        <h3 ref={okRef} tabIndex={-1} className="disp" style={{ fontSize: 'clamp(30px, 3vw, 44px)', marginTop: 20, outline: 'none' }}>Thank you, {first}. <em>Message received.</em></h3>
        <p className="lead" style={{ marginTop: 12 }}>Our team will reply to <strong>{receipt.email}</strong> as soon as possible.{settings.phoneHref && <> For anything urgent, please call <a href={settings.phoneHref}>{settings.phone}</a>.</>}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 26 }}>
          <Link className="btn btn-coral" href="/reservations">Reserve a Table <span className="arr" aria-hidden="true">→</span></Link>
          <button type="button" className="btn btn-ghost" onClick={form.reset}>Send Another Message</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {form.submitted && bad.length > 0 && status !== 'sending' && (
        <div ref={form.summaryRef} tabIndex={-1} className="notice notice-err" role="alert" style={{ marginBottom: 24, outline: 'none' }}>
          <strong>{bad.length === 1 ? 'Please check 1 field: ' : `Please check ${bad.length} fields: `}</strong>
          {bad.map((k, i) => <span key={String(k)}>{i ? ', ' : ''}<a href={`#fld-${String(k)}`} style={{ color: '#A33A2E', fontWeight: 700 }}>{CONTACT_LABELS[k]}</a></span>)}.
        </div>
      )}
      <form noValidate onSubmit={form.onSubmit}>
        <div className="form-2">
          <div className="field">
            <label htmlFor="fld-name">Name <span className="req" aria-hidden="true">*</span></label>
            <input {...fieldProps('name')} className="input" type="text" autoComplete="name" maxLength={120} aria-required="true" />
            <FieldError id="name-err" msg={errFor('name')} />
          </div>
          <div className="field">
            <label htmlFor="fld-email">Email <span className="req" aria-hidden="true">*</span></label>
            <input {...fieldProps('email')} className="input" type="email" autoComplete="email" inputMode="email" maxLength={160} aria-required="true" />
            <FieldError id="email-err" msg={errFor('email')} />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="fld-subject">Subject <span className="req" aria-hidden="true">*</span></label>
            <input {...fieldProps('subject')} className="input" type="text" maxLength={140} aria-required="true" />
            <FieldError id="subject-err" msg={errFor('subject')} />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="fld-message">Message <span className="req" aria-hidden="true">*</span></label>
            <textarea {...fieldProps('message', true)} className="input" rows={6} maxLength={1600} aria-required="true" />
            <p id="message-hint" className="hint" style={{ fontSize: 13, textAlign: 'right' }}>{f.message.length} / 1500</p>
            <FieldError id="message-err" msg={errFor('message')} />
          </div>
        </div>
        <div className="sr" aria-hidden="true"><label htmlFor="fld-website">Website</label><input id="fld-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => form.set({ website: e.target.value })} /></div>
        {status === 'failure' && (
          <div className="notice notice-err" role="alert" style={{ marginTop: 26 }}>
            <p style={{ fontWeight: 800, color: '#A33A2E' }}>Your message couldn’t be sent.</p>
            <p style={{ marginTop: 6 }}>{message || 'Your details are still here. Please try again'}{settings.email && <>, or <a href={mailto}>send it by email</a></>}.</p>
            {settings.email && <a className="btn btn-ghost" href={mailto} style={{ marginTop: 14, minHeight: 48 }}>Open This in Your Email <span className="arr" aria-hidden="true">→</span></a>}
          </div>
        )}
        {status === 'duplicate' && <div className="notice notice-warn" role="status" style={{ marginTop: 26 }}><p style={{ fontWeight: 800 }}>Already sent.</p><p style={{ marginTop: 6 }}>{message}</p></div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginTop: 28 }}>
          <button type="submit" className="btn" aria-busy={form.sending} disabled={form.sending} style={{ minWidth: 220 }}>
            {form.sending ? <><span className="spinner" aria-hidden="true" />Sending…</> : <>Send Message <Icon name="send" size={17} sw={1.7} /></>}
          </button>
          <p className="hint" style={{ fontSize: 13.5 }}>Used only to reply to your message.</p>
        </div>
      </form>
    </>
  );
}
