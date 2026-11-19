/** Shared select options for admin forms (kept out of page files: Next.js pages may only export page fields). */
type Opt = { value: string; label: string };
const opts = (pairs: [string, string][]): Opt[] => pairs.map(([value, label]) => ({ value, label }));

/** Placeholder tints, used only while no photo is uploaded (mirror backend TINTS). */
export const TINT_OPTIONS = opts([
  ['plain', 'Ocean (default)'], ['deep', 'Deep ocean'], ['sand', 'Sand'], ['coral', 'Coral'], ['glass', 'Sea glass'], ['char', 'Charcoal'],
]);

/** Menu section layouts from the Menu design (mirror backend LAYOUTS). */
export const LAYOUT_OPTIONS = opts([
  ['left', 'Photo left, list right'], ['right', 'Photo right, list left'], ['two', 'Two-column list'], ['plain', 'Plain list (no photo)'],
]);

/** Dietary markers (mirror backend DIETARY). Shown only when staff set them. */
export const DIETARY_OPTIONS = opts([['GF', 'GF · Gluten-free'], ['V', 'V · Vegetarian'], ['VG', 'VG · Vegan'], ['DF', 'DF · Dairy-free']]);

/** Optional dish labels (mirror backend BADGES). */
export const BADGE_OPTIONS = opts([['', 'None'], ['popular', 'Popular'], ['chef', 'Chef’s pick'], ['seasonal', 'Seasonal'], ['new', 'New']]);
export const BADGE_LABEL: Record<string, string> = { popular: 'Popular', chef: 'Chef’s pick', seasonal: 'Seasonal', new: 'New' };

/** Gallery categories (mirror backend GALLERY_CATEGORIES). */
export const GALLERY_CATEGORY_OPTIONS = ['Seafood & Dishes', 'Restaurant Interiors', 'Food Preparation', 'Dining Moments'].map((c) => ({ value: c, label: c }));

/** Icons available on the public site (components/site/Icons.tsx). */
export const ICON_OPTIONS = ['fish', 'wave', 'cloche', 'cutlery', 'glass', 'shell', 'lamp', 'chair', 'candle', 'spark', 'users', 'heart', 'table', 'pin', 'clock', 'calendar']
  .map((i) => ({ value: i, label: i[0].toUpperCase() + i.slice(1) }));
