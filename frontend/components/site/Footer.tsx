import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';
import { LogoBody } from './Icons';

export const HOURS_NOTE = 'Opening hours to be confirmed. Please call before visiting.';
const LINKS = [
  { href: '/', label: 'Home' }, { href: '/menu', label: 'Menu' }, { href: '/about', label: 'About' }, { href: '/experience', label: 'Our Experience' },
  { href: '/gallery', label: 'Gallery' }, { href: '/reservations', label: 'Reservations' }, { href: '/contact', label: 'Contact' },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="foot on-abyss tide" style={{ padding: 'clamp(80px, 9vw, 120px) 0 34px' }}>
      <div className="wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'space-between', paddingBottom: 54, borderBottom: '1px solid rgba(111,171,181,.3)' }}>
          <div style={{ flex: '1 1 320px', maxWidth: 400 }}>
            <Link className="logo" href="/" aria-label={`${settings.businessName}, home`} style={{ color: '#FAF9F5' }}><LogoBody name={settings.businessName} tagline={settings.tagline} /></Link>
            <p style={{ margin: '24px 0 28px', lineHeight: 1.75, fontSize: 15, color: '#C9D6D5' }}>{settings.footerNote}</p>
            <Link className="btn btn-coral" href="/reservations">Reserve Your Table <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <nav aria-label="Footer" style={{ flex: '0 1 170px' }}>
            <p className="label" style={{ marginBottom: 14, color: '#F4C5BA' }}>Explore</p>
            <ul>{LINKS.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </nav>
          <div style={{ flex: '0 1 290px' }}>
            <p className="label" style={{ marginBottom: 14, color: '#F4C5BA' }}>Visit &amp; contact</p>
            <address style={{ fontStyle: 'normal', lineHeight: 1.75, color: '#DCE7E6', fontSize: 15 }}>
              <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">{settings.addressLine1}<br />{settings.city}, {settings.region} {settings.postalCode}, {settings.country}<span className="sr"> (opens Google Maps in a new tab)</span></a><br />
              {settings.phoneHref && <><a href={settings.phoneHref} style={{ display: 'inline-flex', minHeight: 40, alignItems: 'center' }}>{settings.phone}</a><br /></>}
              {settings.emailHref && <a href={settings.emailHref} style={{ display: 'inline-flex', minHeight: 40, alignItems: 'center', wordBreak: 'break-all' }}>{settings.email}</a>}
            </address>
            <a className="tlink" href={settings.directionsUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 6 }}>Get Directions <span className="arr" aria-hidden="true">↗</span><span className="sr"> (opens Google Maps in a new tab)</span></a>
          </div>
          <div style={{ flex: '0 1 240px' }}>
            <p className="label" style={{ marginBottom: 14, color: '#F4C5BA' }}>Hours</p>
            {settings.hoursVerified ? (
              <>
                {settings.openStatus && <p style={{ fontWeight: 700, color: '#FAF9F5', marginBottom: 8 }}>{settings.openStatus.label}</p>}
                <ul style={{ gap: 2, fontSize: 14, color: '#DCE7E6' }}>
                  {settings.hoursDisplay.map((h) => <li key={h.day}><span style={{ display: 'inline-block', minWidth: 44 }}>{h.day.slice(0, 3)}</span> {h.label}</li>)}
                </ul>
              </>
            ) : (
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#DCE7E6' }}>{HOURS_NOTE}</p>
            )}
            {settings.socialLinks.length > 0 && (
              <>
                <p className="label" style={{ margin: '24px 0 10px', color: '#F4C5BA' }}>Follow</p>
                <ul>{settings.socialLinks.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}<span className="sr"> (opens in a new tab)</span></a></li>)}</ul>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, paddingTop: 26, fontSize: 13, color: '#C9D6D5' }}>
          <p>© {year} {settings.businessName}. All rights reserved.</p>
          <p>Reservation inquiries are confirmed by our team. Menu items and prices are subject to confirmation.</p>
        </div>
      </div>
    </footer>
  );
}

export function StickyCta({ phoneHref }: { phoneHref: string | null }) {
  return (
    <div className="sticky-cta" role="region" aria-label="Quick actions">
      <Link className="btn btn-coral" href="/reservations">Reserve a Table</Link>
      {phoneHref ? <a className="btn btn-ghost" href={phoneHref}>Call</a> : <Link className="btn btn-ghost" href="/contact">Contact</Link>}
    </div>
  );
}
