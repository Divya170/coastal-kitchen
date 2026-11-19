import type { Metadata } from 'next';
import { Em } from '@/components/site/Em';
import { HOURS_NOTE } from '@/components/site/Footer';
import { Icon } from '@/components/site/Icons';
import { PageHero } from '@/components/site/PageHero';
import { ReservationForm } from '@/components/site/ReservationForm';
import { copy, getPageCopy, getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Reservations', description: 'Send Coastal Kitchen a reservation inquiry. Our team will check availability and contact you to confirm.' };

export default async function ReservationsPage() {
  const [pc, settings] = await Promise.all([getPageCopy(), getSettings()]);
  const hero = copy(pc, 'reservations_hero');
  const form = copy(pc, 'reservations_form');

  return (
    <main id="main">
      <PageHero crumb="Reservations" image={hero.imageUrl} alt={hero.alt} tint="sand" minHeight="clamp(500px, 44vw, 640px)" padBottom="clamp(52px, 6vw, 84px)">
        <div className="g12" style={{ marginTop: 'clamp(28px, 5vw, 64px)', alignItems: 'end' }}>
          <h1 id="page-h" className="disp reveal" style={{ gridColumn: 'span 7', fontSize: 'clamp(54px, 7.4vw, 120px)' }}><Em text={hero.title} /></h1>
          {hero.body && <p className="lead reveal-2" style={{ gridColumn: '9 / span 4' }}>{hero.body}</p>}
        </div>
      </PageHero>

      <section aria-label="Reservation inquiry" className="shell tide" style={{ padding: 'clamp(56px, 7vw, 104px) 0 clamp(88px, 10vw, 150px)' }}>
        <div className="wrap res-grid">
          <div className="res-card">
            <ReservationForm settings={settings} eyebrow={form.eyebrow} title={form.title} notice={form.body} />
          </div>
          <aside className="res-side" aria-label="Restaurant information">
            <div className="side-card on-abyss">
              <p className="label" style={{ color: '#F4C5BA' }}>How it works</p>
              <ol className="steps">
                <li><b aria-hidden="true">1</b><span><strong>Send your inquiry</strong>Choose a date, time and party size.</span></li>
                <li><b aria-hidden="true">2</b><span><strong>We check availability</strong>Our team reviews your request.</span></li>
                <li><b aria-hidden="true">3</b><span><strong>We confirm with you</strong>You’ll hear back by phone or email.</span></li>
              </ol>
            </div>
            <div className="side-card" style={{ background: '#FAF9F5', border: '1px solid #E2D7C3' }}>
              {settings.phoneHref && <div className="info-row"><span className="info-ic"><Icon name="phone" size={19} sw={1.6} /></span><div><p className="label">Prefer to call?</p><a href={settings.phoneHref}>{settings.phone}</a></div></div>}
              {settings.emailHref && <div className="info-row"><span className="info-ic"><Icon name="mail" size={19} sw={1.6} /></span><div><p className="label">Email</p><a href={settings.emailHref} style={{ wordBreak: 'break-all' }}>{settings.email}</a></div></div>}
              <div className="info-row"><span className="info-ic"><Icon name="pin" size={19} sw={1.6} /></span><div><p className="label">Address</p><p style={{ fontSize: 15, lineHeight: 1.55, marginTop: 4 }}>{settings.addressLine1}<br />{settings.city}, {settings.region} {settings.postalCode}, {settings.country}</p><a href={settings.directionsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>Get Directions ↗<span className="sr"> (opens Google Maps in a new tab)</span></a></div></div>
              <div className="info-row"><span className="info-ic"><Icon name="clock" size={19} sw={1.6} /></span><div><p className="label">Hours</p>
                {settings.hoursVerified ? (
                  <>
                    {settings.openStatus && <p style={{ fontWeight: 700, marginTop: 4 }}>{settings.openStatus.label}</p>}
                    <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0, fontSize: 14, lineHeight: 1.7 }}>{settings.hoursDisplay.map((h) => <li key={h.day}>{h.day.slice(0, 3)} · {h.label}</li>)}</ul>
                  </>
                ) : (
                  <><p style={{ fontSize: 15, lineHeight: 1.55, marginTop: 4 }}>{HOURS_NOTE}</p><p className="todo" style={{ marginTop: 10, fontSize: 12.5 }}><span className="todo-tag">Placeholder</span>Not yet confirmed.</p></>
                )}
              </div></div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
