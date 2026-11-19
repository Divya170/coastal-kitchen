'use client';

import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';
import { GALLERY_CATEGORY_OPTIONS, TINT_OPTIONS } from '@/lib/admin-options';

export default function GalleryAdmin() {
  return (
    <EntityManager
      title="Gallery"
      singular="Photo"
      subtitle="Photos on the Gallery page and the homepage “A closer look” collage. Items without an uploaded photo show as labelled placeholders. Use genuine photographs of Coastal Kitchen only: never stock or generated images presented as the restaurant or its food."
      endpoint="/admin/gallery"
      searchPlaceholder="Search photo titles…"
      filters={[{ name: 'category', label: 'Category', options: GALLERY_CATEGORY_OPTIONS }]}
      defaults={{ title: '', category: GALLERY_CATEGORY_OPTIONS[0].value, alt: '', rows: 1, cols: 1, tint: 'plain', featuredOnHome: false, published: true }}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', options: GALLERY_CATEGORY_OPTIONS, required: true, help: 'Only categories that contain photos appear as filters on the site.' },
        { name: 'alt', label: 'Photo description (alt text)', type: 'text', help: 'Describe what the photo shows for screen-reader users.' },
        { name: 'rows', label: 'Tile height (1–3 rows)', type: 'number' },
        { name: 'cols', label: 'Tile width (1–3 columns)', type: 'number' },
        { name: 'tint', label: 'Placeholder tint', type: 'select', options: TINT_OPTIONS, help: 'Only used while no photo is uploaded.' },
        { name: 'featuredOnHome', label: 'Show in the homepage collage', type: 'boolean', help: 'The first five featured photos, by display order, are used.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Photo', render: (r) => (r.imageUrl ? <img className="thumb" src={mediaUrl(r.imageUrl) ?? ''} alt="" /> : <div className="thumb-ph" />) }, // eslint-disable-line @next/next/no-img-element
        { label: 'Title', render: (r) => <><strong>{r.title}</strong>{!r.imageUrl && <> <span className="pill pill-todo">Placeholder</span></>}</> },
        { label: 'Category', render: (r) => r.category },
        { label: 'Homepage', render: (r) => (r.featuredOnHome ? 'Collage' : '—') },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{ getUrl: (r) => r.imageUrl, hint: 'JPG, PNG, WebP or AVIF, up to 8 MB. Genuine photographs of Coastal Kitchen only.' }}
      emptyText="No gallery photos yet."
      rowLabel={(r) => r.title}
    />
  );
}
