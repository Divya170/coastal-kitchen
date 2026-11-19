'use client';

import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';
import { ICON_OPTIONS, TINT_OPTIONS } from '@/lib/admin-options';

const TYPES = [
  { value: 'page_copy', label: 'Page copy' },
  { value: 'hero_slide', label: 'Homepage hero photo' },
  { value: 'experience_point', label: 'Home: experience point' },
  { value: 'philosophy_item', label: 'About: what we care about' },
  { value: 'prep_step', label: 'About: kitchen step' },
  { value: 'atmosphere_item', label: 'Experience: atmosphere' },
  { value: 'occasion', label: 'Experience: occasion' },
  { value: 'highlight', label: 'Experience: highlight' },
];
const TINTS = [{ value: '', label: 'Default' }, ...TINT_OPTIONS];
const typeLabel = (t: string) => TYPES.find((x) => x.value === t)?.label ?? t;
type V = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Page-copy blocks whose section shows a photo (home_intro also has a small second photo). */
const IMAGE_KEYS = ['home_intro', 'home_experience', 'home_reserve', 'menu_hero', 'about_hero', 'about_story', 'experience_hero', 'experience_cta', 'gallery_hero', 'reservations_hero', 'contact_hero'];
const IMAGE2_KEYS = ['home_intro'];
const PHOTO_TYPES = ['hero_slide', 'philosophy_item', 'prep_step', 'atmosphere_item', 'occasion', 'highlight'];
const hasPhoto = (v: V) => PHOTO_TYPES.includes(v.type) || IMAGE_KEYS.includes(v.key);
const is = (...t: string[]) => (v: V) => t.includes(v.type);
/** Page copy shows a field only if that block was seeded with it, so editors never see options a section can't use. */
const has = (f: string) => (v: V) => v.type === 'page_copy' && typeof v.fields?.[f] === 'string';

export default function ContentAdmin() {
  return (
    <EntityManager
      title="Page content"
      singular="Content block"
      subtitle="Headings, paragraphs, photos and the repeating items on Home, About and Experience. Wrap words in *asterisks* to show them in the italic accent. Clear a “Client to supply” note once the real copy is approved. Don’t add founding dates, awards, chef names, sourcing claims, statistics or testimonials unless Coastal Kitchen has supplied and verified them."
      endpoint="/admin/content"
      searchPlaceholder="Search titles, text or keys…"
      filters={[{ name: 'type', label: 'Type', options: TYPES }]}
      defaults={{ type: 'experience_point', key: '', title: '', body: '', fields: { icon: 'fish', tint: '', alt: '', cta: '', href: '', emphasis: '' }, published: true }}
      fields={[
        { name: 'type', label: 'Type', type: 'select', options: TYPES, createOnly: true, required: true },
        { name: 'key', label: 'Key', type: 'text', nullable: true, createOnly: true, showIf: is('page_copy'), help: 'Page copy is looked up by key (e.g. home_hero). Existing keys are already created.' },
        { name: 'title', label: 'Title / heading', type: 'textarea', required: true, help: 'Wrap words in *asterisks* for the accent, e.g. “A Taste of the Coast, *Served Fresh.*” For hero photos, this is the photo description.' },
        { name: 'body', label: 'Body text', type: 'textarea', nullable: true, showIf: (v) => v.type !== 'hero_slide' },
        { name: 'fields.eyebrow', label: 'Small label above the heading', type: 'text', showIf: has('eyebrow') },
        { name: 'fields.body2', label: 'Second paragraph', type: 'textarea', showIf: has('body2') },
        { name: 'fields.extra', label: 'Third paragraph', type: 'textarea', showIf: has('extra') },
        { name: 'fields.quote', label: 'Pull quote', type: 'text', showIf: has('quote'), help: 'Leave empty to hide the quote. Only use a real, approved quote.' },
        { name: 'fields.quoteNote', label: 'Pull quote caption', type: 'text', showIf: has('quoteNote') },
        { name: 'fields.badge', label: 'Badge text', type: 'text', showIf: has('badge') },
        { name: 'fields.note', label: 'Small note', type: 'text', showIf: has('note') },
        { name: 'fields.cta', label: 'Button / link text', type: 'text', showIf: (v) => has('cta')(v) || ['occasion', 'highlight'].includes(v.type) },
        { name: 'fields.cta2', label: 'Second button text', type: 'text', showIf: has('cta2') },
        { name: 'fields.href', label: 'Link', type: 'text', showIf: is('highlight'), help: 'A site path such as /menu or /reservations.' },
        { name: 'fields.emphasis', label: 'Emphasised line', type: 'text', showIf: is('highlight') },
        { name: 'fields.icon', label: 'Icon', type: 'select', options: ICON_OPTIONS, showIf: is('experience_point', 'philosophy_item', 'atmosphere_item', 'occasion') },
        { name: 'fields.alt', label: 'Photo description (alt text)', type: 'text', showIf: (v) => IMAGE_KEYS.includes(v.key) || is('philosophy_item', 'atmosphere_item', 'occasion', 'highlight')(v) },
        { name: 'fields.alt2', label: 'Second photo description', type: 'text', showIf: (v) => IMAGE2_KEYS.includes(v.key) },
        { name: 'fields.tint', label: 'Placeholder tint', type: 'select', options: TINTS, showIf: is('hero_slide', 'prep_step', 'atmosphere_item', 'occasion', 'highlight') },
        { name: 'fields.clientNote', label: '“Client to supply” note', type: 'textarea', showIf: is('page_copy'), help: 'Shown on the site as a dashed placeholder note. Clear it to hide.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Type', render: (r) => typeLabel(r.type) },
        { label: 'Key', render: (r) => (r.key ? <code style={{ fontSize: 12 }}>{r.key}</code> : '—') },
        { label: 'Title', render: (r) => <><span style={{ display: 'block', maxWidth: 420 }}>{String(r.title).slice(0, 90)}</span>{r.fields?.clientNote && <span className="pill pill-todo">Needs content</span>}</> },
        { label: 'Photo', render: (r) => (r.fields?.imageUrl ? <img className="thumb" src={mediaUrl(r.fields.imageUrl) ?? ''} alt="" /> : hasPhoto(r) ? <div className="thumb-ph" /> : '—') }, // eslint-disable-line @next/next/no-img-element
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{
        getUrl: (r) => r.fields?.imageUrl,
        hint: 'JPG, PNG, WebP or AVIF, up to 8 MB. Upload genuine photos of Coastal Kitchen only: never stock images presented as the restaurant.',
        slots: [
          { slot: '', label: 'Photo', getUrl: (r) => r.fields?.imageUrl, show: hasPhoto },
          { slot: 'image2Url', label: 'Second photo (small inset)', getUrl: (r) => r.fields?.image2Url, show: (r) => IMAGE2_KEYS.includes(r.key) },
        ],
      }}
      emptyText="No content blocks."
      rowLabel={(r) => (r.key ? `${typeLabel(r.type)} · ${r.key}` : `${typeLabel(r.type)} · ${String(r.title).slice(0, 40)}`)}
    />
  );
}
