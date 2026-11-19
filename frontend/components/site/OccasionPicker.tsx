'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mediaUrl, tintClass } from '@/lib/api';
import type { ContentBlock } from '@/lib/types';
import { Icon } from './Icons';

/** Our Experience occasions: choose one (buttons with aria-pressed) to see its photo and invitation. */
export function OccasionPicker({ items }: { items: ContentBlock[] }) {
  const [i, setI] = useState(0);
  const cur = items[i] ?? items[0];
  if (!cur) return null;
  const url = mediaUrl(cur.fields.imageUrl);
  const tc = tintClass(cur.fields.tint);
  return (
    <div className="occ">
      <div className="occ-list" role="group" aria-label="Choose an occasion">
        {items.map((o, k) => (
          <button key={o.id} type="button" className="occ-btn" aria-pressed={k === i} aria-controls="occ-panel" onClick={() => setI(k)}>
            <span className="occ-ic"><Icon name={o.fields.icon || 'spark'} size={22} /></span>
            <span className="occ-name">{o.title}</span>
            <span className="label" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <div id="occ-panel" className="occ-panel" aria-live="polite">
        <div className={`ph ${tc} ${url ? 'has-img' : ''}`} style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <div className={`ph ${tc} ${url ? 'has-img' : ''} kb`} style={{ position: 'absolute', inset: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {url && <img className="cover" src={url} alt="" />}
          </div>
        </div>
        {!url && cur.fields.alt && <p className="ph-tag" style={{ top: 16, bottom: 'auto' }}>Photo placeholder · {cur.fields.alt}</p>}
        <div key={cur.id} className="occ-copy">
          <p className="label" style={{ color: '#F4C5BA' }}>{String(i + 1).padStart(2, '0')} · Occasion</p>
          <h3 className="disp" style={{ fontSize: 'clamp(34px, 3.4vw, 52px)', marginTop: 12 }}>{cur.title}</h3>
          {cur.body && <p style={{ marginTop: 12, maxWidth: 520, lineHeight: 1.7, color: '#DCE7E6' }}>{cur.body}</p>}
          <Link className="btn btn-coral" href="/reservations" style={{ marginTop: 24 }}>{cur.fields.cta || 'Reserve Your Table'} <span className="arr" aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  );
}
