export interface DayHoursDisplay { day: string; label: string; confirmed: boolean; isToday: boolean }
export interface DayHours { day: string; open: string | null; close: string | null; closed: boolean }
export interface SocialLink { label: string; url: string }

export interface SiteSettings {
  id: number;
  businessName: string;
  tagline: string;
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string | null;
  phoneVerified: boolean;
  email: string | null;
  mapEmbedUrl: string | null;
  heroAutoplay: boolean;
  heroIntervalSeconds: number;
  experiencePan: boolean;
  maxGuests: number;
  hours: DayHours[];
  hoursVerified: boolean;
  hoursDisplay: DayHoursDisplay[];
  openStatus: { isOpen: boolean; label: string } | null;
  socialLinks: SocialLink[];
  footerNote: string;
  fullAddress: string;
  phoneHref: string | null;
  emailHref: string | null;
  mapsUrl: string;
  directionsUrl: string;
}

export type ContentType = 'page_copy' | 'hero_slide' | 'experience_point' | 'philosophy_item' | 'prep_step' | 'atmosphere_item' | 'occasion' | 'highlight';

export interface ContentBlock {
  id: number;
  type: ContentType;
  key: string | null;
  title: string;
  body: string | null;
  fields: Record<string, string | null>;
  sortOrder: number;
  published: boolean;
}

export type PageCopy = Record<string, ContentBlock | undefined>;
export type Tint = 'plain' | 'deep' | 'sand' | 'coral' | 'glass' | 'char';
export type Layout = 'left' | 'right' | 'two' | 'plain';

export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  blurb: string;
  intro: string;
  layout: Layout;
  imageUrl: string | null;
  imageAlt: string;
  tint: Tint;
  sortOrder: number;
  published: boolean;
  itemCount?: number;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  category?: MenuCategory;
  name: string;
  description: string;
  priceCents: number | null;
  priceNote: string | null;
  dietary: string[];
  badge: string | null;
  imageUrl: string | null;
  imageAlt: string;
  tint: Tint | null;
  featured: boolean;
  highlight: boolean;
  isSample: boolean;
  sortOrder: number;
  published: boolean;
}

export type MenuSection = MenuCategory & { items: MenuItem[] };
export interface MenuResponse { sections: MenuSection[]; total: number }
export type FeaturedDish = MenuItem & { categoryName: string; categorySlug: string };

export type GalleryCategory = 'Seafood & Dishes' | 'Restaurant Interiors' | 'Food Preparation' | 'Dining Moments';

export interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  imageUrl: string | null;
  alt: string;
  rows: number;
  cols: number;
  tint: Tint;
  featuredOnHome: boolean;
  sortOrder: number;
  published: boolean;
}

export interface GalleryResponse {
  category: string;
  categories: { name: string; count: number }[];
  items: GalleryItem[];
}

export type ReservationStatus = 'new' | 'confirmed' | 'declined' | 'archived';
export interface Reservation {
  id: number;
  reference: string;
  guests: number;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  requests: string | null;
  status: ReservationStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
/** What the API returns after a reservation inquiry is stored: received, never confirmed. */
export interface ReservationReceipt {
  received: true;
  status: 'awaiting_confirmation';
  reference: string;
  name: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  createdAt: string;
}

export type InquiryStatus = 'new' | 'responded' | 'archived';
export interface Inquiry {
  id: number;
  reference: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface InquiryReceipt { received: true; name: string; email: string; subject: string; createdAt: string }

export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  errors?: Record<string, string>;
}
