import type { Metadata } from 'next';
import Link from 'next/link';
import { ClientNote } from '@/components/site/ClientNote';
import { Em } from '@/components/site/Em';
import { Icon } from '@/components/site/Icons';
import { OccasionPicker } from '@/components/site/OccasionPicker';
import { PageHero } from '@/components/site/PageHero';
import { Photo } from '@/components/site/Photo';
import { copy, getContent, getPageCopy, getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Our Experience', description: 'The dining experience at Coastal Kitchen: the room, the atmosphere and the occasions it’s made for.' };

const ATMO = ['a1', 'a2', 'a3', 'a4'];

export default async function ExperiencePage() {
  const [pc, atmo, occasions, highlights, settings] = await Promise.all([getPageCopy(), getContent('atmosphere_item'), getContent('occasion'), getContent('highlight'), getSettings()]);
  const hero = copy(pc, 'experience_hero');
  const at = copy(pc, 'experience_atmosphere');
  const oc = copy(pc, 'experience_occasions');
  const hl = copy(pc, 'experience_highlights');
  const cta = copy(pc, 'experience_cta');

  return (
    <main id="main">
      <PageHero crumb="Our Experience" image={hero.imageUrl} alt={hero.alt} tint="deep" motion={settings.experiencePan ? 'pan' : ''} minHeight="clamp(640px, 60vw, 900px)" padBottom="clamp(56px, 7vw, 100px)">
        <h1 id="page-h" className="disp reveal" style={{ marginTop: 'clamp(32px, 6vw, 90px)', fontSize: 'clamp(52px, 7.2vw, 120px)', maxWidth: '14ch' }}><Em text={hero.title} /></h1>
        <div className="reveal-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 34 }}>
          <Link className="btn btn-coral" href="/reservations">Reserve Your Table <span className="arr" aria-hidden="true">→</span></Link>
          <Link className="btn btn-ghost-light" href="/menu">Explore the Menu</Link>
        </div>
      </PageHero>

      {atmo.length > 0 && (
        <section aria-labelledby="atmo-h" className="section">
          <div className="wrap">
            <div className="g12" style={{ alignItems: 'end' }}>
              <div style={{ gridColumn: 'span 6' }}>{at.eyebrow && <p className="eyebrow">{at.eyebrow}</p>}<h2 id="atmo-h" className="h2"><Em text={at.title} /></h2></div>
              {at.body && <p className="lead" style={{ gridColumn: '8 / span 5' }}>{at.body}</p>}
            </div>
            <div className="atmo">
              {atmo.slice(0, 4).map((a, i) => (
                <figure key={a.id} className={`${ATMO[i]} zoom-host`}>
                  <Photo src={a.fields.imageUrl} alt={a.fields.alt || a.title} label={a.fields.alt || a.title} tint={a.fields.tint} zoom tagStyle={{ top: 14, bottom: 'auto' }} style={{ position: 'absolute', inset: 0 }} />
                  <figcaption><strong><Icon name={a.fields.icon || 'wave'} size={22} sw={1.4} />{a.title}</strong>{a.body && <span>{a.body}</span>}</figcaption>
                </figure>
              ))}
            </div>
            <ClientNote note={at.clientNote} style={{ marginTop: 28 }} />
          </div>
        </section>
      )}

      {occasions.length > 0 && (
        <section aria-labelledby="occ-h" className="section shell tide">
          <div className="wrap">
            <div className="g12" style={{ alignItems: 'end', marginBottom: 'clamp(36px, 4vw, 56px)' }}>
              <div style={{ gridColumn: 'span 7' }}>{oc.eyebrow && <p className="eyebrow">{oc.eyebrow}</p>}<h2 id="occ-h" className="h2"><Em text={oc.title} /></h2></div>
              {oc.body && <p className="lead" style={{ gridColumn: '9 / span 4' }}>{oc.body}</p>}
            </div>
            <OccasionPicker items={occasions} />
            <ClientNote note={oc.clientNote} tag="Client to confirm" style={{ marginTop: 32 }} />
          </div>
        </section>
      )}

      {highlights.length > 0 && (
        <section aria-labelledby="hl-h" className="section">
          <div className="wrap">
            {hl.eyebrow && <p className="eyebrow">{hl.eyebrow}</p>}
            <h2 id="hl-h" className="h2" style={{ marginBottom: 'clamp(20px, 3vw, 40px)' }}><Em text={hl.title} /></h2>
            {highlights.map((h, i) => {
              const external = h.fields.href === 'directions';
              const href = external ? settings.directionsUrl : h.fields.href || '/menu';
              return (
                <article key={h.id} className={`hl ${i % 2 ? 'flip' : ''}`}>
                  <div className="hl-img zoom-host" style={{ position: 'relative', aspectRatio: '16 / 10', borderRadius: 8, overflow: 'hidden' }}>
                    <Photo src={h.fields.imageUrl} alt={h.fields.alt || h.title} label={h.fields.alt || h.title} tint={h.fields.tint} zoom style={{ position: 'absolute', inset: 0 }} />
                  </div>
                  <div>
                    <p className="label">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="disp" style={{ fontSize: 'clamp(32px, 3vw, 46px)', marginTop: 12 }}>{h.title} {h.fields.emphasis && <em style={{ color: '#174A5B' }}>{h.fields.emphasis}</em>}</h3>
                    {h.body && <p className="lead" style={{ marginTop: 14 }}>{h.body}</p>}
                    {h.fields.cta && (external
                      ? <a className="tlink" href={href} target="_blank" rel="noopener noreferrer" style={{ marginTop: 18 }}>{h.fields.cta} <span className="arr" aria-hidden="true">↗</span><span className="sr"> (opens Google Maps in a new tab)</span></a>
                      : <Link className="tlink" href={href} style={{ marginTop: 18 }}>{h.fields.cta} <span className="arr" aria-hidden="true">→</span></Link>)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="cta-h" className="hero" style={{ minHeight: 'clamp(520px, 44vw, 660px)', alignItems: 'center' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
          <Photo src={cta.imageUrl} alt="" tint="char" kenBurns noTag style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,51,64,.62)' }} />
        </div>
        {!cta.imageUrl && cta.alt && <p className="ph-tag" style={{ top: 22 }}>Photo placeholder · {cta.alt}</p>}
        <div className="wrap" style={{ position: 'relative', textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
          {cta.eyebrow && <p className="eyebrow" style={{ justifyContent: 'center' }}>{cta.eyebrow}</p>}
          <h2 id="cta-h" className="disp" style={{ fontSize: 'clamp(44px, 6vw, 96px)', margin: '22px auto 0', maxWidth: '14ch' }}><Em text={cta.title} /></h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 36 }}>
            <Link className="btn btn-coral" href="/reservations">Reserve Your Table <span className="arr" aria-hidden="true">→</span></Link>
            {settings.phoneHref && <a className="btn btn-ghost-light" href={settings.phoneHref}>Call {settings.phone}</a>}
          </div>
        </div>
      </section>
    </main>
  );
}
