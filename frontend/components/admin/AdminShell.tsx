'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminFetch, token } from '@/lib/admin-api';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/reservations', label: 'Reservations', badge: 'reservations' as const },
  { href: '/admin/inquiries', label: 'Messages', badge: 'messages' as const },
  { href: '/admin/menu-items', label: 'Dishes' },
  { href: '/admin/categories', label: 'Menu sections' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/content', label: 'Page content' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState<{ email: string; name: string } | null>(null);
  const [counts, setCounts] = useState({ reservations: 0, messages: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token.get()) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname ?? '/admin')}`);
      return;
    }
    adminFetch<{ email: string; name: string }>('/admin-auth/me')
      .then((me) => { setAdmin(me); setReady(true); })
      .catch(() => router.replace('/admin/login'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setOpen(false);
    if (!ready) return;
    Promise.all([
      adminFetch<{ new: number }>('/admin/reservations/stats'),
      adminFetch<{ new: number }>('/admin/inquiries/stats'),
    ]).then(([r, m]) => setCounts({ reservations: r.new, messages: m.new })).catch(() => undefined);
  }, [pathname, ready]);

  if (!ready) {
    return <div className="login-wrap" role="status" aria-live="polite"><p style={{ color: '#E9DDC9' }}>Checking your session…</p></div>;
  }

  const path = pathname ?? '';
  const active = (href: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href));
  const signOut = () => { token.clear(); router.replace('/admin/login'); };

  return (
    <div className="adm">
      <div className="adm-top">
        <span className="serif" style={{ fontSize: 20 }}>Coastal Kitchen · Admin</span>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="adm-side">{open ? 'Close' : 'Menu'}</button>
      </div>
      <aside id="adm-side" className={`adm-side ${open ? 'open' : ''}`} aria-label="Admin navigation">
        <div className="adm-brand">Coastal Kitchen<small>Restaurant admin</small></div>
        <nav className="adm-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined}>
              {n.label}
              {n.badge && counts[n.badge] > 0 && <span className="adm-badge" aria-label={`${counts[n.badge]} new`}>{counts[n.badge]}</span>}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(220,215,205,.18)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          <Link href="/" target="_blank">View website ↗</Link>
          <span style={{ color: '#C9D6D9', wordBreak: 'break-all' }}>{admin?.email}</span>
          <button type="button" className="adm-btn ghost sm" style={{ color: '#FAF9F5', borderColor: 'rgba(250,249,245,.4)' }} onClick={signOut}>Sign out</button>
        </div>
      </aside>
      {open && <div className="drawer-back" style={{ zIndex: 45 }} onClick={() => setOpen(false)} aria-hidden="true" />}
      <main className="adm-main" id="main">{children}</main>
    </div>
  );
}
