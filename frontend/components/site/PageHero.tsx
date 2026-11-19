import { mediaUrl, tintClass } from '@/lib/api';
import { Breadcrumbs } from './Breadcrumbs';

/**
 * Photo hero used by the inner pages: an uploaded photo (or the labelled placeholder) under the ocean shade,
 * with the breadcrumb on top. `motion` picks the slow zoom (kb) or the Experience page's slow pan.
 */
export function PageHero({ id = 'page-h', crumb, image, alt, tint = 'deep', motion = 'kb', minHeight = 'clamp(560px, 52vw, 760px)', padBottom = 'clamp(56px, 7vw, 96px)', children }: {
  id?: string; crumb: string; image?: string | null; alt: string; tint?: string; motion?: 'kb' | 'pan' | ''; minHeight?: string; padBottom?: string; children: React.ReactNode;
}) {
  const url = mediaUrl(image);
  const tc = tintClass(tint);
  return (
    <section aria-labelledby={id} className="hero" style={{ minHeight }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div className={`ph ${tc} ${url ? 'has-img' : ''}`} style={{ position: 'absolute', inset: 0 }}>
          <div className={`ph ${tc} ${url ? 'has-img' : ''} ${motion}`} style={{ position: 'absolute', inset: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {url && <img className="cover" src={url} alt="" fetchPriority="high" />}
          </div>
        </div>
        <div className="hero-shade" />
      </div>
      {!url && alt && <p className="ph-tag">Photo placeholder · {alt}</p>}
      <div className="wrap" style={{ position: 'relative', paddingTop: 150, paddingBottom: padBottom, width: '100%' }}>
        <Breadcrumbs current={crumb} />
        {children}
      </div>
    </section>
  );
}
