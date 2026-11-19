import { ContentBlock } from '../content/content-block.entity';
import { GalleryItem } from '../gallery/gallery-item.entity';
import type { CategorySeed, ItemSeed } from '../menu/menu.service';

/**
 * Seed copy taken from the design (design-source/*.dc.html). See DATA-MODEL.md.
 * Words wrapped in *asterisks* render in the italic accent, as in the design.
 * fields.clientNote renders as a dashed "Client to supply" note until cleared in the admin.
 * Nothing here invents dishes, prices, history, awards, ratings, testimonials, sourcing claims, hours, offers or accounts.
 */
type F = Record<string, string | null>;
const pc = (key: string, title: string, body: string | null, fields: F = {}): Partial<ContentBlock> => ({ type: 'page_copy', key, title, body, fields });
const item = (type: ContentBlock['type'], title: string, body: string, fields: F, sortOrder: number): Partial<ContentBlock> => ({ type, title, body, fields, sortOrder });

export const CONTENT_SEED: Partial<ContentBlock>[] = [
  // Home
  pc('home_hero', 'A Taste of the Coast, *Served Fresh.*', 'Discover thoughtfully prepared seafood and a welcoming dining experience inspired by the beauty of coastal cuisine.', {
    eyebrow: 'Fresh flavors. Coastal spirit.', cta: 'Explore Our Menu', cta2: 'Reserve Your Table',
  }),
  pc('home_intro', 'Where Coastal Flavors Meet *Warm Hospitality.*', 'Coastal Kitchen is a seafood restaurant in Santa Rosa, California, bringing coastal-inspired cooking to a relaxed, welcoming dining room.', {
    eyebrow: 'Welcome to Coastal Kitchen', body2: 'It’s a place for fresh-tasting plates, easy conversation and the kind of meal you’ll want to come back for.',
    cta: 'Read Our Story', badge: 'Coastal cooking, Santa Rosa',
    imageUrl: null, alt: 'Dining room interior, evening light', image2Url: null, alt2: 'Detail: grilled prawns',
    clientNote: 'A short introduction in Allison Reed’s own words. Founding year, history, chef details and any sourcing claims are left out until supplied and verified.',
  }),
  pc('home_dishes', 'From our *kitchen.*', null, {
    eyebrow: 'Featured dishes', cta: 'Explore Full Menu',
    clientNote: 'Signature dishes, dish photography, descriptions and prices. Every dish shown is a clearly marked sample: no real dishes, prices or availability are invented.',
  }),
  pc('home_menu', 'Six ways *to begin.*', 'Choose a section to jump straight to it on the menu.', { eyebrow: 'The menu' }),
  pc('home_experience', 'Relaxed, warm *and unhurried.*', 'A coastal-inspired setting for weeknight dinners, long lunches and the occasions worth celebrating.', {
    eyebrow: 'The dining experience', cta: 'Discover Our Experience', imageUrl: null, alt: 'Wide view of the dining room',
  }),
  pc('home_gallery', 'A closer look at *the coast.*', null, { eyebrow: 'Gallery', cta: 'Explore Gallery' }),
  pc('home_reserve', 'Your Table by the Coast *Awaits.*', 'Make your next dining experience memorable at Coastal Kitchen.', {
    eyebrow: 'Reservations', cta: 'Reserve Your Table', note: 'Reservation requests are inquiries: our team will follow up to confirm.',
    imageUrl: null, alt: 'Set table, warm light',
  }),

  // Menu
  pc('menu_hero', 'Explore *Our Menu.*', 'Discover thoughtfully prepared dishes inspired by fresh coastal flavors.', {
    imageUrl: null, alt: 'Seafood dish on a stone plate, natural light',
    clientNote: 'The full menu: dish names, descriptions, prices and dietary information. Every dish below is a clearly marked sample. No dishes, prices, specials or availability are invented, and nothing here should be read as today’s menu.',
  }),
  pc('menu_cta', 'Found Something *You’ll Love?*', 'Send a reservation inquiry and our team will follow up to confirm your table.', { eyebrow: 'Reservations', cta: 'Make a Reservation' }),

  // About
  pc('about_hero', 'Our Story, Rooted in *Coastal Inspiration.*', null, { imageUrl: null, alt: 'The restaurant at dusk, from the entrance' }),
  pc('about_story', 'A neighborhood table *with a coastal heart.*', 'Coastal Kitchen is a seafood restaurant at 8945 Forest Road in Santa Rosa, California, with a premium-casual dining room built around coastal-inspired cooking.', {
    eyebrow: 'Our story',
    body2: 'The idea is simple: thoughtfully prepared seafood, a relaxed room and a team that makes every guest feel welcome, whether it’s a quick weeknight dinner or a long celebration.',
    extra: '[Editable placeholder: how Coastal Kitchen began, in Allison Reed’s own words: the people behind it, the inspiration, and what makes it personal.]',
    quote: 'Fresh flavors. Coastal spirit.', quoteNote: 'Brand line · to be approved',
    imageUrl: null, alt: 'Dining room, daytime',
    clientNote: 'The restaurant’s history. Founding year, founder or chef biography, milestones, awards, press and partnerships appear only if Coastal Kitchen supplies and verifies them.',
  }),
  pc('about_philosophy', 'What we *care about.*', null, {
    eyebrow: 'Dining philosophy', clientNote: 'Wording to be approved. No locally sourced, sustainable, wild-caught, organic or preparation-method claims are made.',
  }),
  pc('about_prep', 'From the kitchen *to your table.*', 'A look at how dishes come together, from preparation to the final touches before they leave the pass.', {
    eyebrow: 'In the kitchen', clientNote: 'Genuine kitchen photography. Captions stay general until Coastal Kitchen describes its own preparation.',
  }),
  pc('about_cta', 'The rest of the story *is best tasted.*', 'Discover the dining room and the occasions it’s made for, or send a reservation inquiry and our team will follow up.', { eyebrow: 'Come and see for yourself' }),

  // Our Experience
  pc('experience_hero', 'More Than a Meal. *A Coastal Dining Experience.*', null, { imageUrl: null, alt: 'Wide view of the dining room, evening' }),
  pc('experience_atmosphere', 'Settle in, *slow down.*', 'Relaxed sophistication rather than formal luxury: a room for good food, easy conversation and a little coastal calm.', {
    eyebrow: 'Dining atmosphere', clientNote: 'Genuine photographs of the dining room. Captions will be matched to the real interior once photographed.',
  }),
  pc('experience_occasions', 'Every table *has a reason.*', 'Planning something? Share the details in your reservation inquiry and our team will let you know what’s possible.', {
    eyebrow: 'Special occasions', clientNote: 'Private dining, set menus, event packages, decorations or group pricing are not mentioned until Coastal Kitchen confirms them.',
  }),
  pc('experience_highlights', 'Why guests *come back.*', null, { eyebrow: 'Restaurant highlights' }),
  pc('experience_cta', 'Make Room for a *Memorable Experience.*', null, { eyebrow: 'Reservations', imageUrl: null, alt: 'Candlelit table' }),

  // Gallery
  pc('gallery_hero', 'A Closer Look at *Coastal Kitchen.*', null, { imageUrl: null, alt: 'Seafood platter from above, full width' }),
  pc('gallery_grid', 'Plates, rooms *& moments.*', null, {
    eyebrow: 'The gallery',
    clientNote: 'Genuine or licensed photography of Coastal Kitchen’s dishes, dining room and kitchen. Every tile is a labelled placeholder: no illustration is presented as the real restaurant or its food.',
  }),
  pc('gallery_cta', 'Better *in person.*', 'The best view of Coastal Kitchen is from your own table. Send a reservation inquiry and our team will follow up to confirm.', { eyebrow: 'Visit us' }),

  // Reservations
  pc('reservations_hero', 'Let’s Save *You a Seat.*', 'Planning a meal at Coastal Kitchen? Send us your reservation inquiry and our team can follow up with you.', {
    imageUrl: null, alt: 'An elegant table set for dinner',
  }),
  pc('reservations_form', 'Tell us about *your visit.*', 'This is a reservation inquiry, not an instant booking. Our team will check availability and contact you to confirm.', { eyebrow: 'Reservation inquiry' }),

  // Contact
  pc('contact_hero', 'We’d Love to *Hear From You.*', 'Questions, feedback or planning a visit? Call, email or send a message, and our team will be glad to help.', {
    imageUrl: null, alt: 'Warm view of the dining room',
  }),
  pc('contact_location', 'Find us on *Forest Road.*', null, { eyebrow: 'Location' }),
  pc('contact_form', 'How can we *help?*', 'For general questions and feedback. To request a table, please use the reservation inquiry form.', { eyebrow: 'Send a message' }),

  // Hero photos (placeholders until real photographs are uploaded)
  item('hero_slide', 'Grilled seafood, plated, natural light', '', { imageUrl: null, tint: 'coral' }, 0),
  item('hero_slide', 'Prawns over ice, close up', '', { imageUrl: null, tint: 'deep' }, 1),
  item('hero_slide', 'A seafood platter on the table', '', { imageUrl: null, tint: 'plain' }, 2),

  // Home: dining experience points
  item('experience_point', 'Ambience', 'Soft light and a calm, coastal palette.', { icon: 'lamp' }, 0),
  item('experience_point', 'The dining room', 'Room to settle in and share a meal.', { icon: 'table' }, 1),
  item('experience_point', 'Hospitality', 'A welcoming team and an easy pace.', { icon: 'heart' }, 2),
  item('experience_point', 'Special occasions', 'Birthdays, date nights and gatherings.', { icon: 'spark' }, 3),

  // About: philosophy (layout follows order: wide with photo, coral, photo-top, sea-glass, photo-top)
  item('philosophy_item', 'Food Preparation', 'Dishes prepared with care and attention, so the seafood stays the star of the plate.', { icon: 'cloche', alt: 'Plating in the kitchen', imageUrl: null }, 0),
  item('philosophy_item', 'Ingredient Quality', 'Good ingredients, chosen to let coastal flavors speak for themselves.', { icon: 'fish' }, 1),
  item('philosophy_item', 'Attention to Detail', 'From the plating to the table setting, the small things are considered.', { icon: 'cutlery', alt: 'Table setting detail', imageUrl: null }, 2),
  item('philosophy_item', 'Hospitality', 'A welcoming team and an easy pace, whether you’re a regular or here for the first time.', { icon: 'heart' }, 3),
  item('philosophy_item', 'Dining Atmosphere', 'A coastal-inspired setting designed for relaxed, sociable meals.', { icon: 'lamp', alt: 'Evening atmosphere', imageUrl: null }, 4),

  // About: kitchen photos
  item('prep_step', 'Preparation', 'Preparing seafood in the kitchen', { imageUrl: null, tint: 'char' }, 0),
  item('prep_step', 'Plating', 'Plating a dish', { imageUrl: null, tint: 'coral' }, 1),
  item('prep_step', 'Presentation', 'Final touches before service', { imageUrl: null, tint: 'glass' }, 2),

  // Our Experience
  item('atmosphere_item', 'Interiors', 'Natural textures and a calm coastal palette.', { icon: 'shell', alt: 'Restaurant interior', imageUrl: null, tint: 'deep' }, 0),
  item('atmosphere_item', 'Seating', 'Tables for two, for families and for friends.', { icon: 'chair', alt: 'Seating area', imageUrl: null, tint: 'sand' }, 1),
  item('atmosphere_item', 'Table settings', 'Simple, considered and ready for sharing.', { icon: 'cutlery', alt: 'Table setting', imageUrl: null, tint: 'glass' }, 2),
  item('atmosphere_item', 'Lighting & ambience', 'Soft, warm light as the evening settles in.', { icon: 'lamp', alt: 'Evening lighting', imageUrl: null, tint: 'char' }, 3),
  item('occasion', 'Family Gatherings', 'Pull up a few more chairs. Share plates around the table and let everyone find a favorite.', { icon: 'users', cta: 'Plan a Family Meal', alt: 'A family table, sharing plates', imageUrl: null, tint: 'sand' }, 0),
  item('occasion', 'Date Nights', 'A relaxed table for two, good food and an evening that doesn’t need to be rushed.', { icon: 'candle', cta: 'Reserve a Table for Two', alt: 'A table for two, evening light', imageUrl: null, tint: 'char' }, 1),
  item('occasion', 'Celebrations', 'Birthdays, anniversaries and good news. Mention the occasion in your inquiry so our team knows.', { icon: 'spark', cta: 'Plan a Celebration', alt: 'Raising a glass at the table', imageUrl: null, tint: 'coral' }, 2),
  item('occasion', 'Group Dining', 'Coming with a larger group? Include your party size and any details in your inquiry, and our team will follow up.', { icon: 'table', cta: 'Send a Group Inquiry', alt: 'A long table set for a group', imageUrl: null, tint: 'deep' }, 3),
  item('highlight', 'A menu that', 'Seafood is the heart of the menu, with appetizers, mains, sides and desserts to round out the table.', { emphasis: 'puts seafood first.', cta: 'Explore the Menu', href: '/menu', alt: 'Seafood dishes on the pass', imageUrl: null, tint: 'coral' }, 0),
  item('highlight', 'Premium,', 'Relaxed sophistication: thoughtful food and service in a setting that feels easy to return to.', { emphasis: 'never stuffy.', cta: 'See the Gallery', href: '/gallery', alt: 'Guests at a table by the window', imageUrl: null, tint: 'sand' }, 1),
  item('highlight', 'Easy to find', '8945 Forest Road, Santa Rosa, CA 95401, USA. Send a reservation inquiry online or call us to plan your visit.', { emphasis: 'in Santa Rosa.', cta: 'Get Directions', href: 'directions', alt: 'The entrance on Forest Road', imageUrl: null, tint: 'glass' }, 2),
];

/** Menu sections from the brief, with general (not dish-specific) descriptions and the design's layouts and tints. */
export const MENU_CATEGORY_SEED: CategorySeed[] = [
  { slug: 'seafood', name: 'Seafood', blurb: 'From the sea, prepared with care.', intro: 'The heart of the menu. Seafood dishes will be listed here once Coastal Kitchen supplies them.', layout: 'left', tint: 'coral', imageAlt: 'Seafood dish' },
  { slug: 'appetizers', name: 'Appetizers', blurb: 'Small plates to start the table.', intro: 'Small plates to start the table and share.', layout: 'right', tint: 'sand', imageAlt: 'Appetizers to share' },
  { slug: 'mains', name: 'Main Courses', blurb: 'Plates for the main event.', intro: 'Larger plates for the main event.', layout: 'two', tint: 'deep', imageAlt: 'Main course, plated' },
  { slug: 'sides', name: 'Sides', blurb: 'To share alongside.', intro: 'To share alongside your meal.', layout: 'plain', tint: 'glass', imageAlt: 'Sides on the table' },
  { slug: 'desserts', name: 'Desserts', blurb: 'A sweet finish.', intro: 'A sweet finish.', layout: 'left', tint: 'char', imageAlt: 'Dessert, close up' },
  { slug: 'beverages', name: 'Beverages', blurb: 'Something to pour alongside your meal.', intro: 'Something to pour alongside your meal. The drinks list is to be supplied by Coastal Kitchen.', layout: 'plain', tint: 'plain', imageAlt: 'Drinks at the bar' },
];

/** Clearly identified SAMPLE dishes: no real names, descriptions, prices, dietary markers or availability. */
export const SAMPLE_DESCRIPTION = 'Placeholder for a Coastal Kitchen dish. Name, description and price to be supplied by the restaurant.';
const n = (category: string, label: string, from: number, count: number): ItemSeed[] =>
  Array.from({ length: count }, (_, i) => ({ category, name: `Sample ${label} No. ${from + i}`, tint: null, imageAlt: '' }));
export const MENU_ITEM_SEED: ItemSeed[] = [
  { category: 'seafood', name: 'Sample Signature Dish', tint: 'coral', imageAlt: 'Signature seafood plate', featured: true, highlight: true },
  { category: 'seafood', name: 'Sample Seafood Dish No. 1', tint: 'deep', imageAlt: 'Seafood dish', featured: true },
  ...n('seafood', 'Seafood Dish', 2, 5),
  { category: 'appetizers', name: 'Sample Appetizer No. 1', tint: 'sand', imageAlt: 'Appetizer to share', featured: true, highlight: true },
  ...n('appetizers', 'Appetizer', 2, 4),
  { category: 'mains', name: 'Sample Main Course No. 1', tint: 'deep', imageAlt: 'Main course, plated', highlight: true },
  { category: 'mains', name: 'Sample Main Course No. 2', tint: 'plain', imageAlt: 'Main course, from above', highlight: true },
  ...n('mains', 'Main Course', 3, 4),
  ...n('sides', 'Side', 1, 4),
  { category: 'desserts', name: 'Sample Dessert No. 1', tint: 'char', imageAlt: 'Dessert, close up', featured: true, highlight: true },
  ...n('desserts', 'Dessert', 2, 3),
  ...n('beverages', 'Beverage', 1, 6),
];

const g = (category: string, title: string, rows: number, cols: number, tint: string, featuredOnHome = false) =>
  ({ category, title, rows, cols, tint, featuredOnHome }) as Partial<GalleryItem>;
/** Order, tile sizes and tints exactly as in the design's Gallery page; the first five flagged fill the homepage collage. */
export const GALLERY_SEED: Partial<GalleryItem>[] = [
  g('Seafood & Dishes', 'Seafood platter, from above', 3, 2, 'coral', true),
  g('Restaurant Interiors', 'The dining room, evening', 2, 2, 'deep', true),
  g('Food Preparation', 'Plating at the pass', 2, 1, 'char', true),
  g('Dining Moments', 'Glasses raised at the table', 2, 1, 'sand'),
  g('Seafood & Dishes', 'Grilled prawns, close up', 2, 1, 'plain'),
  g('Restaurant Interiors', 'Window seating, daylight', 3, 1, 'glass'),
  g('Seafood & Dishes', 'Grilled fish with greens', 2, 2, 'sand'),
  g('Food Preparation', 'Fresh herbs on the board', 1, 1, 'glass'),
  g('Dining Moments', 'A table for two', 2, 1, 'char', true),
  g('Restaurant Interiors', 'Table setting detail', 1, 1, 'sand', true),
  g('Seafood & Dishes', 'Dessert to share', 2, 1, 'char'),
  g('Food Preparation', 'The kitchen at work', 2, 2, 'deep'),
  g('Dining Moments', 'A family table, sharing plates', 2, 2, 'coral'),
  g('Restaurant Interiors', 'The bar at dusk', 2, 1, 'plain'),
].map((x, i) => ({ ...x, alt: x.title, sortOrder: i }) as Partial<GalleryItem>);
