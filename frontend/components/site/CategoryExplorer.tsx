'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mediaUrl, tintClass } from '@/lib/api';
import type { MenuSection } from '@/lib/types';
import { Icon } from './Icons';

/** Homepage menu-section list: hovering or focusing a section swaps the preview photo; each links to /menu#slug. */
export function CategoryExplorer({ sections, heading }: { sections: Pick<MenuSection, 'id' | 'slug' | 'name' | 'blurb' | 'imageUrl' | 'imageAlt' | 'tint'>[]; heading: React.ReactNode }) {
  const [cur, setCur] = useState(0);
  const c = sections[cur] ?? sections[0];
  if (!c) return null;
  const url = mediaUrl(c.imageUrl);
  return (
    <div className="wrap cat-explorer">
      <div>
      {heading}
      <ul className="cat-list" style={{ marginTop: 36 }}>
        {sections.map((s, i) => {
          const thumb = mediaUrl(s.imageUrl);
          return (
            <li key={s.id}>
              <Link className="cat-link" href={`/menu#${s.slug}`} data-on={i === cur ? 'true' : 'false'} onMouseEnter={() => setCur(i)} onFocus={() => setCur(i)}>
                <span className="cat-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className={`ph ${tintClass(s.tint)} ${thumb ? 'has-img' : ''} cat-thumb`} aria-hidden="true" style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {thumb && <img className="cover" src={thumb} alt="" loading="lazy" />}
                </span>
                <span><span className="cat-name">{s.name}</span>{s.blurb && <span className="cat-blurb">{s.blurb}</span>}</span>
                <span className="cat-go" aria-hidden="true"><Icon name="next" size={16} sw={1.8} /></span>
              </Link>
            </li>
          );
        })}
      </ul>
      </div>
      <div className="cat-preview" aria-hidden="true">
        <div className={`ph ${tintClass(c.tint)} ${url ? 'has-img' : ''}`} style={{ aspectRatio: '4 / 5', borderRadius: 8, transition: 'background-color .6s ease' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url ? <img key={url} className="cover" src={url} alt="" style={{ borderRadius: 8, animation: 'rise .4s ease both' }} /> : <p className="ph-tag">Photo placeholder · {c.imageAlt || c.name}</p>}
        </div>
        <p className="serif" style={{ fontSize: 26, marginTop: 18 }}>{c.name}</p>
      </div>
    </div>
  );
}

