import type { Metadata } from 'next';
import Link from 'next/link';
import { ClientNote } from '@/components/site/ClientNote';
import { Em } from '@/components/site/Em';
import { GalleryBrowser } from '@/components/site/GalleryBrowser';
import { PageHero } from '@/components/site/PageHero';
import { copy, getGallery, getPageCopy, getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Gallery', description: 'A closer look at Coastal Kitchen: seafood and dishes, the dining room, the kitchen and dining moments.' };

export default async function GalleryPage({ searchParams }: { searchParams: { category?: string } }) {
  const [pc, gallery, settings] = await Promise.all([getPageCopy(), getGallery(), getSettings()]);
  const hero = copy(pc, 'gallery_hero');
  const grid = copy(pc, 'gallery_grid');
  const cta = copy(pc, 'gallery_cta');
  const placeholders = gallery.items.filter((i) => !i.imageUrl).length;

  return (
    <main id="main">
      <PageHero crumb="Gallery" image={hero.imageUrl} alt={hero.alt} tint="coral" minHeight="clamp(560px, 54vw, 800px)">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 28, marginTop: 'clamp(32px, 6vw, 90px)' }}>
          <h1 id="page-h" className="disp reveal" style={{ fontSize: 'clamp(54px, 7.6vw, 128px)', maxWidth: '12ch' }}><Em text={hero.title} /></h1>
          <a className="tlink reveal-2" href="#gal-h">Browse the gallery <span className="arr" aria-hidden="true">↓</span></a>
        </div>
      </PageHero>

      <section aria-labelledby="gal-h" className="section" style={{ paddingTop: 'clamp(72px, 8vw, 120px)' }}>
        <div className="wrap">
          <div className="g12" style={{ alignItems: 'end' }}>
            <div style={{ gridColumn: 'span 7' }}>{grid.eyebrow && <p className="eyebrow">{grid.eyebrow}</p>}<h2 id="gal-h" className="h2" style={{ scrollMarginTop: 110 }}><Em text={grid.title} /></h2></div>
            {placeholders > 0 && <div style={{ gridColumn: '8 / span 5' }}><ClientNote note={grid.clientNote} /></div>}
          </div>
          <GalleryBrowser items={gallery.items} categories={gallery.categories} initialCategory={searchParams.category} />
        </div>
      </section>

      <section aria-labelledby="cta-h" className="on-abyss tide" style={{ padding: 'clamp(88px, 10vw, 150px) 0' }}>
        <div className="wrap split">
          <div>{cta.eyebrow && <p className="eyebrow">{cta.eyebrow}</p>}<h2 id="cta-h" className="h2" style={{ color: '#FAF9F5', fontSize: 'clamp(42px, 5vw, 78px)' }}><Em text={cta.title} onDark /></h2></div>
          <div>
            {cta.body && <p className="lead">{cta.body}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
              <Link className="btn btn-coral" href="/reservations">Reserve Your Table <span className="arr" aria-hidden="true">→</span></Link>
              <a className="btn btn-ghost-light" href={settings.directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions<span className="sr"> (opens Google Maps in a new tab)</span></a>
            </div>
            <p className="hint" style={{ marginTop: 18 }}>{settings.fullAddress}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
