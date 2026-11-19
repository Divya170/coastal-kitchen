import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/site/ContactForm';
import { CopyAddress } from '@/components/site/CopyAddress';
import { Em } from '@/components/site/Em';
import { HoursTable } from '@/components/site/HoursTable';
import { Icon } from '@/components/site/Icons';
import { MapPanel } from '@/components/site/MapPanel';
import { PageHero } from '@/components/site/PageHero';
import { copy, getPageCopy, getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Contact', description: 'Call, email or visit Coastal Kitchen at 8945 Forest Road, Santa Rosa, CA, or send us a message.' };

export default async function ContactPage() {
  const [pc, settings] = await Promise.all([getPageCopy(), getSettings()]);
  const hero = copy(pc, 'contact_hero');
  const loc = copy(pc, 'contact_location');
  const form = copy(pc, 'contact_form');
  const line2 = `${settings.city}, ${settings.region} ${settings.postalCode}, ${settings.country}`;

  return (
    <main id="main">
      <PageHero crumb="Contact" image={hero.imageUrl} alt={hero.alt} tint="sand" minHeight="clamp(520px, 46vw, 680px)" padBottom="clamp(100px, 10vw, 140px)">
        <div className="g12" style={{ marginTop: 'clamp(28px, 5vw, 64px)', alignItems: 'end' }}>
          <h1 id="page-h" className="disp reveal" style={{ gridColumn: 'span 7', fontSize: 'clamp(54px, 7.4vw, 120px)' }}><Em text={hero.title} /></h1>
          {hero.body && <p className="lead reveal-2" style={{ gridColumn: '9 / span 4' }}>{hero.body}</p>}
        </div>
      </PageHero>

      <section aria-label="Contact details" style={{ paddingBottom: 'clamp(72px, 8vw, 120px)' }}>
        <div className="wrap">
          <div className="ct-cards">
            <div className="ct-card">
              <p className="label" style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="pin" size={18} sw={1.6} /> Address</p>
              <address className="ct-val" style={{ fontStyle: 'normal' }}>{settings.addressLine1},<br />{line2}</address>
              <div className="ct-acts">
                <a className="tlink" href={settings.directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions <span className="arr" aria-hidden="true">↗</span><span className="sr"> (opens Google Maps in a new tab)</span></a>
                <CopyAddress text={settings.fullAddress} />
              </div>
            </div>
            {settings.phoneHref && (
              <div className="ct-card">
                <p className="label" style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="phone" size={18} sw={1.6} /> Phone</p>
                <a className="ct-val" href={settings.phoneHref}>{settings.phone}</a>
                <div className="ct-acts"><a className="tlink" href={settings.phoneHref}>Call {settings.businessName} <span className="arr" aria-hidden="true">→</span></a></div>
              </div>
            )}
            {settings.emailHref && (
              <div className="ct-card">
                <p className="label" style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="mail" size={18} sw={1.6} /> Email</p>
                <a className="ct-val" href={settings.emailHref}>{settings.email}</a>
                <div className="ct-acts"><a className="tlink" href={`${settings.emailHref}?subject=${encodeURIComponent(`Hello ${settings.businessName}`)}`}>Write to Us <span className="arr" aria-hidden="true">→</span></a></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="visit" aria-labelledby="loc-h" className="section shell tide" style={{ paddingTop: 'clamp(72px, 8vw, 120px)' }}>
        <div className="wrap g12" style={{ alignItems: 'start' }}>
          <div style={{ gridColumn: 'span 7' }}>
            {loc.eyebrow && <p className="eyebrow">{loc.eyebrow}</p>}
            <h2 id="loc-h" className="h2" style={{ marginBottom: 30 }}><Em text={loc.title} /></h2>
            <MapPanel settings={settings} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
              <a className="btn" href={settings.directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions <span className="arr" aria-hidden="true">↗</span><span className="sr"> (opens Google Maps in a new tab)</span></a>
              <a className="btn btn-ghost" href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">View on Google Maps<span className="sr"> (opens in a new tab)</span></a>
            </div>
            <p className="hint" style={{ marginTop: 16, fontSize: 13.5 }}>The map shows the address as supplied: {settings.fullAddress}.</p>
          </div>
          <div style={{ gridColumn: '9 / span 4' }}><HoursTable settings={settings} /></div>
        </div>
      </section>

      <section aria-labelledby="form-h" className="section">
        <div className="wrap g12" style={{ alignItems: 'start' }}>
          <div style={{ gridColumn: 'span 4' }}>
            {form.eyebrow && <p className="eyebrow">{form.eyebrow}</p>}
            <h2 id="form-h" className="h2" style={{ fontSize: 'clamp(36px, 3.6vw, 56px)' }}><Em text={form.title} /></h2>
            {form.body && <p className="lead" style={{ marginTop: 18 }}>{form.body}</p>}
            <Link className="tlink" href="/reservations" style={{ marginTop: 16 }}>Make a Reservation Inquiry <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <div style={{ gridColumn: '6 / span 7' }}><ContactForm settings={settings} /></div>
        </div>
      </section>
    </main>
  );
}
