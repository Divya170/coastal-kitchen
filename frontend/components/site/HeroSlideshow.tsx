'use client';

import { useEffect, useRef, useState } from 'react';
import { mediaUrl, tintClass } from '@/lib/api';
import type { ContentBlock } from '@/lib/types';
import { Icon } from './Icons';

/**
 * Homepage hero: slow cross-fade (1.8s) every 6–8s with a gentle zoom. Holds while the visitor hovers, focuses or
 * touches it (resuming a moment later), pauses on the button, offscreen, in a hidden tab and for reduced motion.
 * The headline and CTAs (children) never move.
 */
export function HeroSlideshow({ slides, autoplay, intervalSeconds, label, footNote, children }: {
  slides: ContentBlock[]; autoplay: boolean; intervalSeconds: number; label: string; footNote?: React.ReactNode; children: React.ReactNode;
}) {
  const count = Math.max(1, slides.length);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(!autoplay);
  const [hold, setHold] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const release = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setPaused(true);
    const el = ref.current;
    const io = el && 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 }) : null;
    if (io && el) io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => { io?.disconnect(); document.removeEventListener('visibilitychange', onVis); clearTimeout(release.current); };
  }, []);

  useEffect(() => {
    if (paused || hold || !visible || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), Math.min(8, Math.max(6, intervalSeconds)) * 1000);
    return () => clearInterval(t);
  }, [paused, hold, visible, count, intervalSeconds]);

  const holdNow = () => { clearTimeout(release.current); setHold(true); };
  const letGo = () => { clearTimeout(release.current); release.current = setTimeout(() => setHold(false), 1200); };
  const current = slides[index];

  return (
    <section ref={ref} aria-label={label} className="hero home-hero" onMouseEnter={holdNow} onMouseLeave={letGo} onFocus={holdNow} onBlur={letGo} onTouchStart={holdNow} onTouchEnd={letGo}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {(slides.length ? slides : [null]).map((s, i) => {
          const url = mediaUrl(s?.fields?.imageUrl);
          const tc = tintClass(s?.fields?.tint);
          return (
            <div key={s?.id ?? i} className={`ph ${tc} ${url ? 'has-img' : ''} hero-slide`} style={{ opacity: i === index ? 1 : 0 }}>
              <div className={`ph ${tc} ${url ? 'has-img' : ''} kb`} style={{ position: 'absolute', inset: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {url && <img className="cover" src={url} alt="" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} />}
              </div>
            </div>
          );
        })}
        <div className="hero-shade" />
      </div>
      {current && !current.fields?.imageUrl && <p className="ph-tag">Photo placeholder · {current.title}</p>}
      {children}
      <div className="hero-foot">
        <div className="wrap">
          <a className="hero-cue" href="#intro-h">
            <svg className="scrollcue" width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 1v18M2 14l5 6 5-6" /></svg>
            Scroll to discover
          </a>
          {footNote && <p className="hide-sm" style={{ fontSize: 13.5, color: '#DCE7E6' }}>{footNote}</p>}
          {count > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="slide-bar" aria-hidden="true">
                {slides.map((s, i) => <span key={s.id} style={{ width: i === index ? 36 : 14, background: i === index ? '#E98270' : 'rgba(250,249,245,.45)' }} />)}
              </div>
              <button type="button" className="icon-btn" style={{ width: 44, height: 44, color: '#FAF9F5' }} aria-label={paused ? 'Play hero photos' : 'Pause hero photos'} onClick={() => setPaused((p) => !p)}>
                <Icon name={paused ? 'play' : 'pause'} size={15} sw={1.8} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
