'use client';

import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';
import { LAYOUT_OPTIONS, TINT_OPTIONS } from '@/lib/admin-options';

const layoutLabel = (v: string) => LAYOUT_OPTIONS.find((o) => o.value === v)?.label ?? v;

export default function MenuSectionsAdmin() {
  return (
    <EntityManager
      title="Menu sections"
      singular="Section"
      subtitle="The sections of the Menu page (Starters, Mains and so on), in display order. They also appear as the homepage “Six ways to begin” tiles and the menu’s jump links. A section appears on the site only while it is published and has at least one published dish. Its link (/menu#…) is fixed when the section is created."
      endpoint="/admin/menu-categories"
      searchPlaceholder="Search sections…"
      defaults={{ name: '', blurb: '', intro: '', layout: 'left', tint: 'plain', imageAlt: '', published: true }}
      fields={[
        { name: 'name', label: 'Section name', type: 'text', required: true, help: 'e.g. “Starters”.' },
        { name: 'blurb', label: 'Short line', type: 'textarea', help: 'Shown on the homepage tile. Max 200 characters.' },
        { name: 'intro', label: 'Introduction on the Menu page', type: 'textarea', help: 'One or two sentences above the dishes. Max 300 characters.' },
        { name: 'layout', label: 'Layout on the Menu page', type: 'select', options: LAYOUT_OPTIONS, help: 'Where the section photo sits relative to the dish list.' },
        { name: 'imageAlt', label: 'Photo description (alt text)', type: 'text' },
        { name: 'tint', label: 'Placeholder tint', type: 'select', options: TINT_OPTIONS, help: 'Only used while no photo is uploaded.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Photo', render: (r) => (r.imageUrl ? <img className="thumb" src={mediaUrl(r.imageUrl) ?? ''} alt="" /> : <div className="thumb-ph" />) }, // eslint-disable-line @next/next/no-img-element
        { label: 'Section', render: (r) => <><strong>{r.name}</strong><br /><code style={{ fontSize: 12 }}>/menu#{r.slug}</code></> },
        { label: 'Dishes', render: (r) => r.itemCount ?? 0 },
        { label: 'Layout', render: (r) => layoutLabel(r.layout) },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? (r.itemCount ? 'Published' : 'Published · hidden until it has dishes') : 'Hidden'}</span> },
      ]}
      image={{ getUrl: (r) => r.imageUrl, hint: 'JPG, PNG, WebP or AVIF, up to 8 MB. Genuine photographs of Coastal Kitchen’s dishes only.' }}
      emptyText="No menu sections yet. Add one before adding dishes."
      rowLabel={(r) => r.name}
    />
  );
}
