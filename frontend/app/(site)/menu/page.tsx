import type { Metadata } from 'next';
import Link from 'next/link';
import { ClientNote } from '@/components/site/ClientNote';
import { Em } from '@/components/site/Em';
import { MenuNav } from '@/components/site/MenuNav';
import { PageHero } from '@/components/site/PageHero';
import { Photo } from '@/components/site/Photo';
import { BADGE_LABELS, DIETARY_LABELS, copy, getMenu, getPageCopy, getSettings, priceText } from '@/lib/api';
import type { MenuItem } from '@/lib/types';

export const metadata: Metadata = { title: 'Menu', description: 'Explore Coastal Kitchen’s menu: seafood, appetizers, main courses, sides, desserts and beverages.' };

const LAYOUT_CLASS = { left: 'lay-left', right: 'lay-right', two: 'lay-two', plain: 'lay-plain' } as const;

function PriceTag({ i }: { i: MenuItem }) {
  const p = priceText(i);
  return p ? <span className="price">{p}</span> : <span className="price-tbc">Price to be supplied</span>;
}

/** Confirmed dietary markers and label only; a sample shows its "Sample" tag instead. */
function Markers({ i }: { i: MenuItem }) {
  return (
    <>
      {i.isSample && <span className="sample">Sample</span>}
      {i.badge && <span className="badge-label">{BADGE_LABELS[i.badge] ?? i.badge}</span>}
      {i.dietary.map((d) => <abbr key={d} className="diet on" title={DIETARY_LABELS[d] ?? d} style={{ textDecoration: 'none' }}>{d}<span className="sr"> ({DIETARY_LABELS[d] ?? d})</span></abbr>)}
    </>
  );
}

export default async function MenuPage() {
  const [pc, menu, settings] = await Promise.all([getPageCopy(), getMenu(), getSettings()]);
  const hero = copy(pc, 'menu_hero');
  const cta = copy(pc, 'menu_cta');
  const anySample = menu.sections.some((s) => s.items.some((i) => i.isSample));
  const anyDiet = menu.sections.some((s) => s.items.some((i) => i.dietary.length));

  return (
    <main id="main">
      <PageHero crumb="Menu" image={hero.imageUrl} alt={hero.alt} tint="coral">
        <div className="g12" style={{ marginTop: 'clamp(28px, 5vw, 70px)', alignItems: 'end' }}>
          <h1 id="page-h" className="disp reveal" style={{ gridColumn: 'span 7', fontSize: 'clamp(56px, 8vw, 132px)' }}><Em text={hero.title} /></h1>
          <div className="reveal-2" style={{ gridColumn: '9 / span 4' }}>
            {hero.body && <p className="lead">{hero.body}</p>}
            <Link className="btn btn-coral" href="/reservations" style={{ marginTop: 24 }}>Reserve a Table <span className="arr" aria-hidden="true">→</span></Link>
          </div>
        </div>
      </PageHero>

      {menu.sections.length > 0 && <MenuNav sections={menu.sections.map((s) => ({ slug: s.slug, name: s.name, count: s.items.length }))} total={menu.total} />}

      <div className="wrap" style={{ paddingTop: 'clamp(40px, 5vw, 64px)' }}>
        <div className="g12" style={{ alignItems: 'start' }}>
          <div style={{ gridColumn: 'span 7' }}>{anySample && <ClientNote note={hero.clientNote} />}</div>
          <div style={{ gridColumn: '9 / span 4' }}>
            <p className="label">Dietary key</p>
            <div className="legend" style={{ marginTop: 12 }}>
              {Object.entries(DIETARY_LABELS).map(([k, v]) => <span key={k} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><span className={`diet ${anyDiet ? 'on' : ''}`} aria-hidden="true">{k}</span><span className={anyDiet ? '' : 'sr'}>{v}</span></span>)}
              <span>{anyDiet ? 'Please tell our team about any allergies when you order.' : 'Markers appear beside dishes only once the kitchen confirms them.'}</span>
            </div>
          </div>
        </div>
      </div>

      {menu.sections.length === 0 ? (
        <section className="section"><div className="wrap"><div className="empty-card">
          <p className="disp" style={{ fontSize: 36 }}>The menu is being prepared</p>
          <p className="hint" style={{ marginTop: 10 }}>Please call us{settings.phone ? ` on ${settings.phone}` : ''} for today’s dishes, or send a reservation inquiry.</p>
          <Link className="btn btn-coral" href="/reservations" style={{ marginTop: 22 }}>Reserve Your Table</Link>
        </div></div></section>
      ) : menu.sections.map((s, n) => {
        const layout = s.layout === 'plain' ? 'plain' : s.layout;
        const highlights = layout === 'plain' ? [] : s.items.filter((i) => i.highlight).slice(0, layout === 'two' ? 2 : 1);
        const list = s.items.filter((i) => !highlights.includes(i));
        const cls = highlights.length ? LAYOUT_CLASS[layout] : 'lay-plain';
        return (
          <section key={s.id} id={s.slug} aria-labelledby={`${s.slug}-h`} className={`menu-sec ${cls}`}>
            <div className="wrap">
              <div className="menu-head">
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}><span className="menu-no" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span><h2 id={`${s.slug}-h`} className="h2" style={{ margin: 0 }}>{s.name}</h2></div>
                {s.intro && <p className="lead" style={{ maxWidth: 560 }}>{s.intro}</p>}
              </div>
              <div className="menu-body">
                <div className="feat-col">
                  {highlights.map((d) => (
                    <article key={d.id} className="feat zoom-host" aria-labelledby={`dish-${d.id}`}>
                      <Photo src={d.imageUrl} alt={d.imageAlt || d.name} label={d.imageAlt || d.name} tint={d.tint ?? s.tint} zoom style={{ aspectRatio: '4 / 3.4' }} />
                      <div className="feat-copy">
                        <p style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><span className="label">Featured · {s.name}</span><Markers i={d} /></p>
                        <h3 id={`dish-${d.id}`} className="h3" style={{ marginTop: 10 }}>{d.name}</h3>
                        <p className="hint" style={{ marginTop: 6 }}>{d.isSample ? 'Description to be supplied by Coastal Kitchen.' : d.description}</p>
                        <p style={{ marginTop: 14 }}><PriceTag i={d} /></p>
                      </div>
                    </article>
                  ))}
                </div>
                {list.length > 0 && (
                  <ul className="menu-list" aria-label={`${s.name} dishes`}>
                    {list.map((d) => (
                      <li key={d.id} className="menu-item">
                        <div className="mi-top"><h3 className="mi-name" style={{ margin: 0 }}>{d.name}</h3><span className="mi-dots" aria-hidden="true" /><PriceTag i={d} /></div>
                        <p className="mi-desc"><Markers i={d} />{d.isSample ? 'Description to be supplied.' : d.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section aria-labelledby="cta-h" className="section on-abyss tide" style={{ textAlign: 'center' }}>
        <div className="wrap">
          {cta.eyebrow && <p className="eyebrow" style={{ justifyContent: 'center' }}>{cta.eyebrow}</p>}
          <h2 id="cta-h" className="disp" style={{ fontSize: 'clamp(46px, 6vw, 96px)', margin: '22px auto 0', maxWidth: '13ch' }}><Em text={cta.title} onDark /></h2>
          {cta.body && <p className="lead" style={{ margin: '22px auto 0', maxWidth: 500 }}>{cta.body}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 34 }}>
            <Link className="btn btn-coral" href="/reservations">{cta.fields.cta || 'Make a Reservation'} <span className="arr" aria-hidden="true">→</span></Link>
            {settings.phoneHref && <a className="btn btn-ghost-light" href={settings.phoneHref}>Call {settings.phone}</a>}
          </div>
        </div>
      </section>
    </main>
  );
}
