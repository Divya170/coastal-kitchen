'use client';

import { useEffect, useState } from 'react';

/**
 * Sticky section chips with scroll-spy: the section nearest the top (under the header and this bar) is marked
 * aria-current. Clicking jumps to the section anchor (/menu#slug works from other pages too).
 */
export function MenuNav({ sections, total }: { sections: { slug: string; name: string; count: number }[]; total: number }) {
  const [active, setActive] = useState(sections[0]?.slug);
  useEffect(() => {
    const onScroll = () => {
      let cur = sections[0]?.slug;
      for (const s of sections) {
        const el = document.getElementById(s.slug);
        if (el && el.getBoundingClientRect().top <= 170) cur = s.slug;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  return (
    <nav aria-label="Menu sections" className="menu-nav">
      <div className="wrap">
        <div className="chips" style={{ paddingTop: 12, paddingBottom: 12 }}>
          {sections.map((s) => (
            <a key={s.slug} className="chip" href={`#${s.slug}`} aria-current={active === s.slug ? 'true' : undefined} onClick={() => setActive(s.slug)}>
              {s.name}<span className="n">{s.count}</span>
            </a>
          ))}
        </div>
        <p className="hint hide-sm" style={{ flex: 'none' }}>{total} {total === 1 ? 'dish' : 'dishes'} · {sections.length} sections</p>
      </div>
    </nav>
  );
}
