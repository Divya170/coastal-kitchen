'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ErrorPanel } from '@/components/admin/ui';
import { adminFetch } from '@/lib/admin-api';
import { formatDate, formatReceived, formatTime } from '@/lib/admin-format';
import type { Inquiry, Reservation, SiteSettings } from '@/lib/types';

interface ResStats { new: number; confirmed: number; declined: number; archived: number; total: number; upcoming: number; today: number; nextToConfirm: Reservation[] }
interface MsgStats { new: number; responded: number; archived: number; total: number }
interface Counts { total: number; samples: number; published: number; noPrice: number; noPhoto: number }
interface Checklist extends Counts { galleryPlaceholders: number; gallery: number; contentNotes: number; hoursVerified: boolean; phoneVerified: boolean; social: number }

function Item({ done, href, children }: { done: boolean; href: string; children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span aria-hidden="true" style={{ flex: '0 0 18px', height: 18, borderRadius: '50%', marginTop: 2, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, background: done ? '#E2F0EC' : '#FBE9E5', color: done ? '#1E5A47' : '#A84B39' }}>{done ? '✓' : '!'}</span>
      <span><span className="sr-only">{done ? 'Done: ' : 'To do: '}</span><Link href={href}>{children}</Link></span>
    </li>
  );
}

export default function Dashboard() {
  const [res, setRes] = useState<ResStats | null>(null);
  const [msg, setMsg] = useState<MsgStats | null>(null);
  const [recentMsgs, setRecentMsgs] = useState<Inquiry[] | null>(null);
  const [check, setCheck] = useState<Checklist | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [r, m, recent, counts, gallery, content, settings] = await Promise.all([
        adminFetch<ResStats>('/admin/reservations/stats'),
        adminFetch<MsgStats>('/admin/inquiries/stats'),
        adminFetch<{ items: Inquiry[] }>('/admin/inquiries?status=new&pageSize=5'),
        adminFetch<Counts>('/admin/menu-items/counts'),
        adminFetch<{ imageUrl: string | null }[]>('/admin/gallery'),
        adminFetch<{ fields: Record<string, string | null> }[]>('/admin/content'),
        adminFetch<SiteSettings>('/admin/settings'),
      ]);
      setRes(r);
      setMsg(m);
      setRecentMsgs(recent.items);
      setCheck({
        ...counts, gallery: gallery.length, galleryPlaceholders: gallery.filter((g) => !g.imageUrl).length,
        contentNotes: content.filter((c) => c.fields?.clientNote).length,
        hoursVerified: settings.hoursVerified, phoneVerified: settings.phoneVerified, social: settings.socialLinks.length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the dashboard.');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats: [string, number | undefined, string][] = [
    ['Reservations to confirm', res?.new, '/admin/reservations?status=new&when=all'],
    ['Today', res?.today, '/admin/reservations?when=today'],
    ['Upcoming', res?.upcoming, '/admin/reservations?when=upcoming'],
    ['New messages', msg?.new, '/admin/inquiries'],
  ];

  return (
    <>
      <div className="adm-head"><div><h1 className="adm-h1">Dashboard</h1><p className="adm-sub">Reservation inquiries and messages from the website, plus what still needs real content before launch.</p></div></div>
      {error && <ErrorPanel message={error} onRetry={load} />}
      <div className="adm-grid" style={{ marginBottom: 28 }}>
        {stats.map(([label, v, href]) => (
          <Link key={label} href={href} className="adm-card adm-stat" style={{ textDecoration: 'none', color: 'inherit' }}><p>{label}</p><p>{v ?? '–'}</p></Link>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: '2 1 420px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section className="adm-card" aria-labelledby="next-h">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <h2 id="next-h" className="serif" style={{ margin: 0, fontSize: 24 }}>Next to confirm</h2>
              <Link href="/admin/reservations?status=new&when=upcoming" className="adm-btn ghost sm">All reservations</Link>
            </div>
            <p className="hint" style={{ marginBottom: 8 }}>New, upcoming inquiries, soonest first. Guests are waiting to hear back.</p>
            {res === null ? <div className="skel" style={{ height: 120 }} /> : res.nextToConfirm.length === 0 ? <p className="hint">Nothing waiting. Every upcoming inquiry has been handled.</p> : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {res.nextToConfirm.map((r) => (
                  <li key={r.id} style={{ padding: '12px 0', borderTop: '1px solid #E9DDC9' }}>
                    <Link href={`/admin/reservations?open=${r.id}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <span><strong>{formatDate(r.date, { weekday: 'short', month: 'short', day: 'numeric' })} · {formatTime(r.time)}</strong> <span className="hint">· {r.name}, {r.guests} {r.guests === 1 ? 'guest' : 'guests'}</span></span>
                      <span className="hint">{r.reference}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {res && res.total > 0 && <p className="hint" style={{ marginTop: 12 }}>{res.total} inquiries in total · {res.confirmed} confirmed · {res.declined} declined · {res.archived} archived</p>}
          </section>

          <section className="adm-card" aria-labelledby="msg-h">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <h2 id="msg-h" className="serif" style={{ margin: 0, fontSize: 24 }}>New messages</h2>
              <Link href="/admin/inquiries" className="adm-btn ghost sm">All messages</Link>
            </div>
            {recentMsgs === null ? <div className="skel" style={{ height: 100 }} /> : recentMsgs.length === 0 ? <p className="hint">No new messages. You’re all caught up.</p> : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {recentMsgs.map((i) => (
                  <li key={i.id} style={{ padding: '12px 0', borderTop: '1px solid #E9DDC9' }}>
                    <Link href={`/admin/inquiries?open=${i.id}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <span><strong>{i.name}</strong> <span className="hint">· {i.subject}</span></span>
                      <span className="hint">{formatReceived(i.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {msg && msg.total > 0 && <p className="hint" style={{ marginTop: 12 }}>{msg.total} messages in total · {msg.responded} responded · {msg.archived} archived</p>}
          </section>
        </div>

        <section className="adm-card" style={{ flex: '1 1 300px' }} aria-labelledby="launch-h">
          <h2 id="launch-h" className="serif" style={{ margin: '0 0 12px', fontSize: 24 }}>Launch checklist</h2>
          {!check ? <div className="skel" style={{ height: 160 }} /> : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              <Item done={check.phoneVerified} href="/admin/settings">{check.phoneVerified ? 'Phone number verified' : 'Verify the phone number: 856 is a southern New Jersey area code, while Santa Rosa numbers use 707'}</Item>
              <Item done={check.hoursVerified} href="/admin/settings">{check.hoursVerified ? 'Opening hours confirmed' : 'Opening hours not confirmed: the site shows “Hours to be confirmed”'}</Item>
              <Item done={check.samples === 0} href="/admin/menu-items">{check.samples ? `${check.samples} of ${check.total} dishes are still sample placeholders` : 'No sample dishes left'}</Item>
              <Item done={check.noPrice === 0} href="/admin/menu-items">{check.noPrice ? `${check.noPrice} dishes have no price yet (shown as “Price to be supplied”)` : 'Every dish has a price or price note'}</Item>
              <Item done={check.noPhoto === 0} href="/admin/menu-items">{check.noPhoto ? `${check.noPhoto} dishes have no photo yet` : 'Every dish has a photo'}</Item>
              <Item done={check.galleryPlaceholders === 0} href="/admin/gallery">{check.galleryPlaceholders ? `${check.galleryPlaceholders} of ${check.gallery} gallery items are placeholders` : 'All gallery items have photos'}</Item>
              <Item done={check.contentNotes === 0} href="/admin/content">{check.contentNotes ? `${check.contentNotes} content blocks still show “Client to supply” notes` : 'No placeholder notes left'}</Item>
              <Item done={check.social > 0} href="/admin/settings">{check.social ? `${check.social} official social links added` : 'No social links yet (optional; official accounts only)'}</Item>
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
