'use client';

import { useEffect, useState } from 'react';
import { EntityManager } from '@/components/admin/EntityManager';
import { adminFetch } from '@/lib/admin-api';
import { BADGE_LABEL, BADGE_OPTIONS, DIETARY_OPTIONS, TINT_OPTIONS } from '@/lib/admin-options';
import { mediaUrl } from '@/lib/api';
import type { MenuCategory } from '@/lib/types';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const TINTS = [{ value: '', label: 'Section default' }, ...TINT_OPTIONS];

export default function DishesAdmin() {
  const [cats, setCats] = useState<{ value: string; label: string }[] | null>(null);
  const [catError, setCatError] = useState('');

  useEffect(() => {
    adminFetch<MenuCategory[]>('/admin/menu-categories')
      .then((c) => setCats(c.map((x) => ({ value: String(x.id), label: x.published ? x.name : `${x.name} (hidden)` }))))
      .catch((e) => setCatError(e instanceof Error ? e.message : 'Could not load menu sections.'));
  }, []);

  if (catError) return <div role="alert" className="notice-error">{catError}</div>;
  if (!cats) return <div className="skel" style={{ height: 320 }} role="status" aria-label="Loading" />;
  if (cats.length === 0) {
    return (
      <div className="adm-empty">
        <p>Add a menu section first. Every dish belongs to a section.</p>
        <a className="adm-btn" style={{ marginTop: 16 }} href="/admin/categories">Go to Menu sections</a>
      </div>
    );
  }
  const catName = (id: number) => cats.find((c) => c.value === String(id))?.label ?? '—';

  return (
    <EntityManager
      title="Dishes"
      singular="Dish"
      subtitle="Everything on the Menu page, plus the homepage “From our kitchen” dishes. Dishes marked Sample are placeholders from the design: replace them with the real menu and untick Sample. Leave the price empty until it’s confirmed; the site then shows “Price to be supplied”. Only add dietary markers and labels the kitchen has confirmed."
      endpoint="/admin/menu-items"
      searchPlaceholder="Search dish names and descriptions…"
      filters={[
        { name: 'categoryId', label: 'Section', options: cats },
        { name: 'status', label: 'Status', options: [{ value: 'sample', label: 'Samples' }, { value: 'real', label: 'Real dishes' }, { value: 'noprice', label: 'No price yet' }, { value: 'hidden', label: 'Hidden' }] },
      ]}
      defaults={{ categoryId: cats[0].value, name: '', description: '', priceCents: '', priceNote: '', dietary: [], badge: '', imageAlt: '', tint: '', featured: false, highlight: false, isSample: false, published: true }}
      fields={[
        { name: 'categoryId', label: 'Menu section', type: 'select', options: cats, numeric: true, required: true },
        { name: 'name', label: 'Dish name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', help: 'Only what the kitchen confirms. No sourcing, sustainability or organic claims unless verified.' },
        { name: 'priceCents', label: 'Price (USD)', type: 'money', help: 'e.g. 28.50. Leave empty if not supplied yet.' },
        { name: 'priceNote', label: 'Price note', type: 'text', nullable: true, help: 'Instead of, or next to, a price, e.g. “Market price”. Max 40 characters.' },
        { name: 'dietary', label: 'Dietary markers', type: 'multi', options: DIETARY_OPTIONS, help: 'Shown with the key on the Menu page. Only add markers the kitchen has confirmed.' },
        { name: 'badge', label: 'Label', type: 'select', options: BADGE_OPTIONS, nullable: true },
        { name: 'featured', label: 'Feature on the homepage (“From our kitchen”)', type: 'boolean', help: 'The first four featured dishes are shown; the first one is shown large.' },
        { name: 'highlight', label: 'Highlight card on the Menu page', type: 'boolean', help: 'Shown as a photo card at the top of its section.' },
        { name: 'isSample', label: 'Sample placeholder (shows a “Sample” tag)', type: 'boolean' },
        { name: 'imageAlt', label: 'Photo description (alt text)', type: 'text' },
        { name: 'tint', label: 'Placeholder tint', type: 'select', options: TINTS, nullable: true, help: 'Only used while no photo is uploaded.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Photo', render: (r) => (r.imageUrl ? <img className="thumb" src={mediaUrl(r.imageUrl) ?? ''} alt="" /> : <div className="thumb-ph" />) }, // eslint-disable-line @next/next/no-img-element
        { label: 'Dish', render: (r) => <><strong>{r.name}</strong>{r.isSample && <> <span className="pill pill-todo">Sample</span></>}<br /><span className="hint">{(r.dietary ?? []).join(' · ')}{r.badge ? `${r.dietary?.length ? ' · ' : ''}${BADGE_LABEL[r.badge] ?? r.badge}` : ''}</span></> },
        { label: 'Section', render: (r) => r.category?.name ?? catName(r.categoryId) },
        { label: 'Price', render: (r) => (r.priceCents != null ? usd.format(r.priceCents / 100) : r.priceNote ? r.priceNote : <span className="pill pill-todo">To be supplied</span>) },
        { label: 'Shown', render: (r) => [r.featured && 'Home', r.highlight && 'Highlight'].filter(Boolean).join(' · ') || '—' },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{ getUrl: (r) => r.imageUrl, hint: 'JPG, PNG, WebP or AVIF, up to 8 MB. Use genuine photographs of Coastal Kitchen’s own dishes only.' }}
      emptyText="No dishes yet."
      rowLabel={(r) => r.name}
    />
  );
}
