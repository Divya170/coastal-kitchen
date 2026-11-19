'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { SiteSettings } from '@/lib/types';
import { Icon, LogoBody } from './Icons';

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Our Experience' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];
const DRAWER = [...NAV.slice(0, 5), { href: '/reservations', label: 'Reservations' }, NAV[5]];

/**
 * Fixed header: clear over each page's photo hero, solid once the page scrolls.
 * Pages without a photo hero at the top (e.g. the error screen) get the solid header straight away.
 */
export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname() ?? '/';
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  // Watch the page content (it swaps in after loading skeletons) to know whether a photo hero is at the top.
  useEffect(() => {
    const check = () => setOverHero(!!document.querySelector('#main > .hero:first-child'));
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    if (!menu) {
      if (opened.current) toggleRef.current?.focus();
      return;
    }
    opened.current = true;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, [menu]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return setMenu(false);
    if (e.key !== 'Tab' || !panelRef.current) return;
    const nodes = panelRef.current.querySelectorAll<HTMLElement>('a[href], button');
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const solid = scrolled || !overHero;
  const tagline = settings.tagline;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`hdr ${solid ? 'hdr-solid' : 'hdr-clear'}`}>
        <div className="wrap hdr-in" style={{ height: solid ? 72 : 96 }}>
          <Link className="logo" href="/" aria-label={`${settings.businessName}, home`}><LogoBody name={settings.businessName} tagline={tagline} /></Link>
          <nav aria-label="Primary" className="nav-links">
            {NAV.map((n) => <Link key={n.href} className="nav-link" href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>{n.label}</Link>)}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link className="btn btn-coral nav-cta" href="/reservations" aria-current={isActive('/reservations') ? 'page' : undefined} style={{ minHeight: 48, padding: '0 24px' }}>Reservations</Link>
            <Link className="btn btn-coral nav-res-sm" href="/reservations" style={{ minHeight: 44, padding: '0 16px', fontSize: 12 }}>Reserve</Link>
            <button ref={toggleRef} type="button" className="icon-btn nav-toggle" aria-label="Open menu" aria-expanded={menu} aria-controls="site-drawer" onClick={() => setMenu(true)}>
              <Icon name="menu" size={22} sw={1.6} />
            </button>
          </div>
        </div>
      </header>
      {/* Spacer so pages without a photo hero don't sit under the fixed header. */}
      {!overHero && <div aria-hidden="true" style={{ height: 72 }} />}

      {menu && (
        <div className="drawer" onClick={(e) => { if (e.target === e.currentTarget) setMenu(false); }}>
          <div ref={panelRef} id="site-drawer" className="drawer-panel" role="dialog" aria-modal="true" aria-label="Site menu" onKeyDown={onKey}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 60 }}>
              <span className="label" style={{ color: '#F4C5BA' }}>Menu</span>
              <button ref={closeRef} type="button" className="icon-btn" aria-label="Close menu" onClick={() => setMenu(false)}><Icon name="close" size={18} sw={1.6} /></button>
            </div>
            <nav aria-label="Mobile" style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
              {DRAWER.map((n, i) => (
                <Link key={n.href} className="mlink" href={n.href} aria-current={isActive(n.href) ? 'page' : undefined} onClick={() => setMenu(false)}>
                  {n.label}<span className="label" aria-hidden="true">0{i + 1}</span>
                </Link>
              ))}
            </nav>
            <div style={{ marginTop: 'auto', paddingTop: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link className="btn btn-coral" href="/reservations" style={{ width: '100%' }} onClick={() => setMenu(false)}>Reserve Your Table <span className="arr" aria-hidden="true">→</span></Link>
              {settings.phoneHref && <a className="btn btn-ghost-light" href={settings.phoneHref} style={{ width: '100%' }}>Call {settings.phone}</a>}
              <p className="hint" style={{ textAlign: 'center', marginTop: 8, color: '#C9D6D5' }}>{settings.addressLine1}, {settings.city}, {settings.region} {settings.postalCode}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
