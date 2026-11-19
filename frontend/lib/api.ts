import type { ApiErrorBody, ContentBlock, ContentType, FeaturedDish, GalleryItem, GalleryResponse, MenuResponse, PageCopy, SiteSettings, Tint } from './types';

/** Base URL for API calls. Server components may use an internal URL; the browser always uses NEXT_PUBLIC_API_URL. */
export function apiBase() {
  if (typeof window === 'undefined') return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
}

/** Turn a stored upload path (/uploads/x.jpg) into an absolute URL the browser can load. */
export function mediaUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const origin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${origin}${path}`;
}

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;
  constructor(status: number, body: ApiErrorBody | null) {
    const msg = Array.isArray(body?.message) ? body?.message.join(' ') : body?.message;
    super(msg || (status >= 500 ? 'Something went wrong on our side. Please try again.' : 'The request could not be completed.'));
    this.status = status;
    this.fieldErrors = body?.errors ?? {};
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${apiBase()}${path}`, {
      cache: 'no-store',
      ...init,
      headers: { Accept: 'application/json', ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    });
  } catch {
    throw new ApiError(0, { message: 'We couldn’t reach Coastal Kitchen’s server. Check your connection and try again.' });
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) throw new ApiError(res.status, (data as ApiErrorBody) ?? null);
  return data as T;
}

/* ---------- public site data (server components) ---------- */
export const getSettings = () => apiFetch<SiteSettings>('/settings');
export const getPageCopy = () => apiFetch<PageCopy>('/content/page-copy');
export const getContent = (type: ContentType) => apiFetch<ContentBlock[]>(`/content?type=${type}`);
export const getMenu = () => apiFetch<MenuResponse>('/menu');
export const getFeatured = (limit = 4) => apiFetch<FeaturedDish[]>(`/menu/featured?limit=${limit}`);
export const getGallery = () => apiFetch<GalleryResponse>('/gallery');
export const getGalleryHome = () => apiFetch<GalleryItem[]>('/gallery/home');


/** Read a page-copy block with safe fallbacks so a missing row never crashes a page. */
export function copy(pc: PageCopy, key: string) {
  const b = pc[key];
  return {
    title: b?.title ?? '',
    body: b?.body ?? '',
    eyebrow: b?.fields?.eyebrow ?? '',
    clientNote: b?.fields?.clientNote ?? '',
    imageUrl: b?.fields?.imageUrl ?? null,
    alt: b?.fields?.alt ?? '',
    fields: b?.fields ?? {},
  };
}

/** Split a heading so the *starred* words render in the italic ocean-blue accent, e.g. "A Taste of the Coast, *Served Fresh.*" */
export function emphasis(title: string): { before: string; em: string; after: string } {
  const m = title.match(/^(.*?)\*(.+?)\*(.*)$/);
  return m ? { before: m[1], em: m[2], after: m[3] } : { before: title, em: '', after: '' };
}

/** Placeholder tint → CSS class from the design ("plain" is the default sea-blue panel). */
export function tintClass(t?: Tint | string | null) {
  return t && t !== 'plain' ? `ph-${t}` : '';
}

/** "$28.50" / "$28" from cents, the restaurant's own note (e.g. "Market price"), or the honest placeholder. */
export function priceText(i: { priceCents: number | null; priceNote: string | null }) {
  if (i.priceNote) return i.priceNote;
  if (i.priceCents == null) return null;
  const d = i.priceCents / 100;
  return `$${Number.isInteger(d) ? d : d.toFixed(2)}`;
}

export const BADGE_LABELS: Record<string, string> = { popular: 'Popular', chef: 'Chef’s pick', seasonal: 'Seasonal', new: 'New' };
export const DIETARY_LABELS: Record<string, string> = { GF: 'Gluten-free', V: 'Vegetarian', VG: 'Vegan', DF: 'Dairy-free' };

/** "Sat, March 14, 2026" from YYYY-MM-DD (no timezone shift). */
export function dateText(v: string) {
  const d = new Date(`${v}T12:00:00`);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}
export function timeText(v: string) {
  const [h, m] = v.split(':').map(Number);
  if (Number.isNaN(h)) return v;
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
