import Link from 'next/link';
import { CategoryExplorer } from '@/components/site/CategoryExplorer';
import { ClientNote } from '@/components/site/ClientNote';
import { Em } from '@/components/site/Em';
import { HeroSlideshow } from '@/components/site/HeroSlideshow';
import { Icon } from '@/components/site/Icons';
import { Photo } from '@/components/site/Photo';
import { BADGE_LABELS, copy, getContent, getFeatured, getGalleryHome, getMenu, getPageCopy, getSettings, priceText } from '@/lib/api';
import type { FeaturedDish } from '@/lib/types';

/** Price as supplied, or the honest placeholder. */
function Price({ d, light }: { d: FeaturedDish; light?: boolean }) {
  const p = priceText(d);
  return p ? <span className="price" style={light ? { color: '#F4C5BA' } : undefined}>{p}</span> : <span className="price-tbc" style={light ? { color: '#F4C5BA' } : undefined}>Price to be supplied</span>;
}

/** The homepage collage tiles, in the design's order and shapes. */
const COLLAGE = ['c1', 'c2', 'c3', 'c4', 'c5'];

export default async function HomePage() {
  const [settings, pc, slides, featured, menu, points, gallery] = await Promise.all([
    getSettings(), getPageCopy(), getContent('hero_slide'), getFeatured(4), getMenu(), getContent('experience_point'), getGalleryHome(),
  ]);
  const hero = copy(pc, 'home_hero');
  const intro = copy(pc, 'home_intro');
  const dishes = copy(pc, 'home_dishes');
  const mc = copy(pc, 'home_menu');
  const xp = copy(pc, 'home_experience');
  const gal = copy(pc, 'home_gallery');
  const res = copy(pc, 'home_reserve');
  const [lead, ...rest] = featured;
  const anySample = featured.some((d) => d.isSample);

  return (
    <main id="main">
      <HeroSlideshow slides={slides} autoplay={settings.heroAutoplay} intervalSeconds={settings.heroIntervalSeconds} label={`Welcome to ${settings.businessName}`}
        footNote={<>{settings.addressLine1}, {settings.city}{settings.phoneHref && <> · <a href={settings.phoneHref} style={{ color: '#FAF9F5' }}>{settings.phone}</a></>}</>}>
        <div className="wrap hero-copy">
          {hero.eyebrow && <p className="eyebrow reveal">{hero.eyebrow}</p>}
          <h1 className="disp reveal-2" style={{ marginTop: 24, fontSize: 'clamp(54px, 7.6vw, 124px)', maxWidth: '12ch' }}><Em text={hero.title} /></h1>
          {hero.body && <p className="lead reveal-3" style={{ maxWidth: 500, marginTop: 26 }}>{hero.body}</p>}
          <div className="reveal-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
            <Link className="btn btn-light" href="/menu">{hero.fields.cta || 'Explore Our Menu'} <span className="arr" aria-hidden="true">→</span></Link>
            <Link className="btn btn-coral" href="/reservations">{hero.fields.cta2 || 'Reserve Your Table'}</Link>
          </div>
        </div>
      </HeroSlideshow>

      {/* Introduction */}
      <section aria-labelledby="intro-h" className="section">
        <div className="wrap g12" style={{ alignItems: 'center' }}>
          <div style={{ gridColumn: 'span 5' }}>
            {intro.eyebrow && <p className="eyebrow">{intro.eyebrow}</p>}
            <h2 id="intro-h" className="h2" style={{ fontSize: 'clamp(42px, 4.8vw, 76px)', scrollMarginTop: 110 }}><Em text={intro.title} /></h2>
            <span className="wave-rule" style={{ marginTop: 30 }} />
            {intro.body && <p className="lead prose-copy" style={{ marginTop: 26 }}>{intro.body}</p>}
            {intro.fields.body2 && <p className="lead prose-copy" style={{ marginTop: 14 }}>{intro.fields.body2}</p>}
            <ClientNote note={intro.clientNote} style={{ marginTop: 24 }} />
            <Link className="tlink" href="/about" style={{ marginTop: 24 }}>{intro.fields.cta || 'Read Our Story'} <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <div style={{ gridColumn: '7 / span 6' }}>
            <div className="intro-photos">
              <Photo src={intro.imageUrl} alt={intro.alt} tint="deep" kenBurns style={{ aspectRatio: '6 / 5', borderRadius: 8 }} />
              <div className="intro-inset"><Photo src={intro.fields.image2Url} alt={intro.fields.alt2 ?? ''} tint="coral" style={{ aspectRatio: '1 / 1', borderRadius: 4 }} /></div>
              {intro.fields.badge && <p className="intro-badge" aria-hidden="true">{intro.fields.badge}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Featured dishes */}
      <section aria-labelledby="dish-h" className="section shell tide" style={{ paddingTop: 'clamp(80px, 9vw, 140px)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 'clamp(36px, 4vw, 60px)' }}>
            <div>{dishes.eyebrow && <p className="eyebrow">{dishes.eyebrow}</p>}<h2 id="dish-h" className="h2"><Em text={dishes.title} /></h2></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link className="btn btn-ghost" href="/menu">{dishes.fields.cta || 'Explore Full Menu'} <span className="arr" aria-hidden="true">→</span></Link>
              <Link className="btn btn-coral" href="/reservations">Reserve Your Table</Link>
            </div>
          </div>
          {lead ? (
            <div className="g12" style={{ alignItems: 'stretch' }}>
              <article aria-labelledby="dl-h" className="dish-lead zoom-host" style={{ gridColumn: rest.length ? 'span 7' : '1 / -1' }}>
                <div style={{ position: 'absolute', inset: 0 }}><Photo src={lead.imageUrl} alt={lead.imageAlt || lead.name} label={lead.imageAlt || lead.name} tint={lead.tint ?? 'coral'} zoom tagStyle={{ top: 18, bottom: 'auto' }} style={{ position: 'absolute', inset: 0 }} /></div>
                <div className="dish-lead-copy">
                  <p style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="label" style={{ color: '#F4C5BA' }}>{lead.badge ? `${BADGE_LABELS[lead.badge] ?? lead.badge} · ` : 'Featured · '}{lead.categoryName}</span>
                    {lead.isSample && <span className="sample">Sample</span>}
                  </p>
                  <h3 id="dl-h" className="disp" style={{ fontSize: 'clamp(34px, 3.4vw, 52px)', marginTop: 14 }}>{lead.name}</h3>
                  {lead.description && <p style={{ marginTop: 12, maxWidth: 460, lineHeight: 1.7, color: '#DCE7E6' }}>{lead.description}</p>}
                  <p style={{ marginTop: 16, display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}><Price d={lead} light /><Link className="tlink" href={`/menu#${lead.categorySlug}`}>View on menu <span className="arr" aria-hidden="true">→</span></Link></p>
                </div>
              </article>
              {rest.length > 0 && (
                <div style={{ gridColumn: '8 / span 5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {rest.map((d) => (
                    <article key={d.id} className="dish-row" aria-labelledby={`fd-${d.id}`}>
                      <div className="zoom-host" style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 6, overflow: 'hidden' }}>
                        <Photo src={d.imageUrl} alt={d.imageAlt || d.name} label={d.imageAlt || d.categoryName} tint={d.tint} zoom shortTag tagStyle={{ left: 8, bottom: 8, fontSize: 9 }} style={{ position: 'absolute', inset: 0 }} />
                      </div>
                      <div>
                        <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}><span className="label">{d.categoryName}</span>{d.isSample && <span className="sample">Sample</span>}{d.badge && <span className="badge-label">{BADGE_LABELS[d.badge] ?? d.badge}</span>}</p>
                        <h3 id={`fd-${d.id}`} className="h3" style={{ marginTop: 10 }}>{d.name}</h3>
                        {d.description && <p className="hint" style={{ marginTop: 6 }}>{d.isSample ? 'Description to be supplied by Coastal Kitchen.' : d.description}</p>}
                        <div className="dish-meta"><Price d={d} /><Link className="tlink" href={`/menu#${d.categorySlug}`} style={{ minHeight: 40 }}>View on menu<span className="sr">: {d.name}</span> <span className="arr" aria-hidden="true">→</span></Link></div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-card">
              <p className="disp" style={{ fontSize: 34 }}>The menu is being prepared</p>
              <p className="hint" style={{ marginTop: 10 }}>Featured dishes will appear here soon. In the meantime, you’re welcome to reserve a table.</p>
              <Link className="btn btn-coral" href="/reservations" style={{ marginTop: 22 }}>Reserve Your Table</Link>
            </div>
          )}
          {anySample && <ClientNote note={dishes.clientNote} style={{ marginTop: 40 }} />}
        </div>
      </section>

      {/* Menu sections */}
      {menu.sections.length > 0 && (
        <section aria-labelledby="cat-h" className="section">
          <CategoryExplorer sections={menu.sections} heading={<>
            {mc.eyebrow && <p className="eyebrow">{mc.eyebrow}</p>}
            <h2 id="cat-h" className="h2"><Em text={mc.title} /></h2>
            {mc.body && <p className="lead" style={{ marginTop: 18, maxWidth: 480 }}>{mc.body}</p>}
          </>} />
        </section>
      )}

      {/* Dining experience band */}
      <section aria-labelledby="xp-h" className="xp-band">
        <div className="xp-photo zoom-host" style={{ position: 'absolute', inset: 0 }}><Photo src={xp.imageUrl} alt="" label={xp.alt} tint="deep" kenBurns style={{ position: 'absolute', inset: 0 }} /></div>
        <div className="wrap" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
          <div className="xp-card">
            {xp.eyebrow && <p className="eyebrow">{xp.eyebrow}</p>}
            <h2 id="xp-h" className="h2" style={{ fontSize: 'clamp(36px, 3.6vw, 54px)' }}><Em text={xp.title} /></h2>
            {xp.body && <p className="lead" style={{ marginTop: 16 }}>{xp.body}</p>}
            {points.length > 0 && (
              <ul className="xp-points">
                {points.map((p) => <li key={p.id}><span style={{ color: '#A84B39' }}><Icon name={p.fields.icon || 'wave'} size={22} /></span><span><strong>{p.title}</strong>{p.body}</span></li>)}
              </ul>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 30 }}>
              <Link className="btn" href="/experience">{xp.fields.cta || 'Discover Our Experience'} <span className="arr" aria-hidden="true">→</span></Link>
              <Link className="tlink" href="/reservations">Reserve a table <span className="arr" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery collage */}
      {gallery.length > 0 && (
        <section aria-labelledby="gal-h" className="section">
          <div className="wrap">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 'clamp(32px, 4vw, 52px)' }}>
              <div>{gal.eyebrow && <p className="eyebrow">{gal.eyebrow}</p>}<h2 id="gal-h" className="h2"><Em text={gal.title} /></h2></div>
              <Link className="btn btn-ghost" href="/gallery">{gal.fields.cta || 'Explore Gallery'} <span className="arr" aria-hidden="true">→</span></Link>
            </div>
            <div className="collage">
              {gallery.slice(0, 5).map((g, i) => (
                <Link key={g.id} className={`${COLLAGE[i]} zoom-host`} href={`/gallery?category=${encodeURIComponent(g.category)}`} aria-label={`Gallery: ${g.title}`}>
                  <Photo src={g.imageUrl} alt="" label={g.title} tint={g.tint} zoom shortTag style={{ position: 'absolute', inset: 0 }} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reservation CTA */}
      <section aria-labelledby="res-h" className="res-cta on-abyss">
        <div className="tide on-abyss" style={{ padding: 'clamp(64px, 8vw, 120px) clamp(20px, 6vw, 96px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {res.eyebrow && <p className="eyebrow">{res.eyebrow}</p>}
          <h2 id="res-h" className="disp" style={{ fontSize: 'clamp(46px, 5.6vw, 88px)', marginTop: 22, maxWidth: '12ch' }}><Em text={res.title} onDark /></h2>
          {res.body && <p className="lead" style={{ marginTop: 22, maxWidth: 460 }}>{res.body}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 34 }}>
            <Link className="btn btn-coral" href="/reservations">{res.fields.cta || 'Reserve Your Table'} <span className="arr" aria-hidden="true">→</span></Link>
            {settings.phoneHref && <a className="btn btn-ghost-light" href={settings.phoneHref}>Call {settings.phone}</a>}
          </div>
          {res.fields.note && <p className="hint" style={{ marginTop: 22 }}>{res.fields.note}</p>}
        </div>
        <div className="zoom-host" style={{ position: 'relative' }}><Photo src={res.imageUrl} alt="" label={res.alt} tint="sand" kenBurns style={{ position: 'absolute', inset: 0, minHeight: '100%' }} /></div>
      </section>
    </main>
  );
}
