# Coastal Kitchen: data model and design extraction

Source: `design-source/*.dc.html` (Claude Design canvas: Main, Menu, About, Experience, Gallery, Reservations, Contact).
This file is the single reference for the copy, rules and flags taken from those designs. The app must not invent anything the design marks as "to be supplied".

## Identity

**Business**
- Coastal Kitchen, a seafood restaurant at 8945 Forest Road, Santa Rosa, CA 95401, USA.
- Client: Allison Reed.

**Contact**
- Phone: +1 (856) 382-1942, used as supplied. It is flagged because 856 is a southern New Jersey area code; Santa Rosa is 707. The admin launch checklist shows it until `phoneVerified` is on.
- Email: coastalkitchen@outlook.com.

**Hours and social links**
- No opening hours were supplied. The site says "Opening hours to be confirmed. Please call before visiting." and every day shows "Hours to confirm" with a dashed Placeholder badge. This lasts until hours are entered and `hoursVerified` is on.
- Only once hours are verified are reservation times checked against them.
- Social links: none supplied. They are shown only once added in the admin.

**Fonts**
- DM Serif Display for headings, with italic emphasis.
- Manrope for the UI and body text.

**Colours**

| Name | Hex | Notes |
|---|---|---|
| Deep ocean | `#174A5B` | Primary, 9.2:1 on warm white |
| Abyss | `#0F3340` | Dark sections |
| Warm white | `#FAF9F5` | Ground |
| Sand | `#E9DDC9` | |
| Shell | `#F3ECE0` | |
| Charcoal | `#283438` | Text |
| Sea grey | `#5C6766` | Secondary text, 5.6:1 |
| Coral | `#E98270` | Reservation CTA fill with abyss text, 5.0:1 |
| Coral ink | `#A84B39` | Text-safe coral, 5.3:1 |
| Coastal blue | `#6FABB5` | Decorative, or text on dark only |
| Error | `#A33A2E` | |

**Shape**
- Pill buttons.
- 6–10 px radii on images and cards.
- A wave-line eyebrow and a very faint tide-line texture on sand and shell sections.

**Motion**
- Home hero cross-fade every 6–8 s (default 7), with a slow zoom.
  - It holds on hover, focus or touch.
  - It has a pause button.
  - It is still under reduced motion.
- Slow pan on the Our Experience hero; can be turned off in Settings.
- Hover zoom on food imagery.
- Short reveal-on-load. Nothing else auto-advances.

## Hard rules from the brief, enforced in code

**Reservations are inquiries, not bookings**
- `POST /api/reservations` stores a request with status `new` and returns `status: "awaiting_confirmation"`.
- The site's success screen says "Inquiry received. Awaiting confirmation." and "Your table is not booked yet."
- Staff confirm with the guest directly. The admin offers a pre-filled email and tap-to-call, then marks the request Confirmed.
- No email is sent automatically, because no mail service was specified.

**No invented content**
- No dishes, prices, history, awards, ratings, testimonials, sourcing, sustainability or organic claims, hours, offers, private-dining packages or social accounts.

**Menu**
- The 32 seeded dishes are `isSample` and show a "Sample" tag.
- `priceCents` and `priceNote` are null, so the site shows "Price to be supplied".
- Dietary markers (`GF`, `V`, `VG`, `DF`) and labels (popular, chef's pick, seasonal, new) appear only when set by staff.

**Forms and photos**
- No fake form success: a success screen appears only after a 201 response.
- On failure, the typed details stay in the form. The visitor is offered a phone link and a pre-filled email ("Open This in Your Email").
- Every photo is a labelled placeholder until a genuine or licensed image is uploaded.

## Routes

| Route | Design file | Sections |
|---|---|---|
| `/` | Main | Hero slideshow · intro (two photos + badge) · featured dishes (1 large + 3) · menu-section explorer (hover preview) · dining-experience band (4 points) · gallery collage (5) · reservation CTA |
| `/menu` | Menu | Hero · sticky section chips with scroll-spy · dietary key · one section per category (layouts left/right/two/plain; highlight cards + dotted-leader list) · CTA |
| `/about` | About | Hero · story (sticky photo, drop cap, pull quote) · philosophy bento (5) · kitchen photos (3) · CTA |
| `/experience` | Experience | Hero (slow pan) · atmosphere mosaic (4) · occasions chooser (4) · highlights (3, alternating) · CTA |
| `/gallery` | Gallery | Hero · filter chips · masonry grid · lightbox · CTA |
| `/reservations` | Reservations | Hero · inquiry form (guests stepper, date, time, name, email, phone, requests) · "How it works" and contact sidebar |
| `/contact` | Contact | Hero · address/phone/email cards (copy address) · Google Maps embed + directions · hours (placeholder/confirmed legend) · contact form |
| `/admin/*` | — | Login, dashboard, reservations, messages, dishes, menu sections, gallery, page content, settings |

## Entities (SQLite via TypeORM, `database/app.sqlite`)

**`menu_categories`**
- `name`, `slug` (the Menu page anchor, fixed after creation).
- `blurb` (home), `intro` (menu).
- `layout` (`left | right | two | plain`).
- `imageUrl?`, `imageAlt`, `tint`, `sortOrder`, `published`.
- A section shows only while it has at least one published dish.

**`menu_items`**
- `categoryId`, `name`, `description`.
- `priceCents?`, `priceNote?`, `dietary[]`, `badge?`.
- `imageUrl?`, `imageAlt`, `tint?`.
- `featured` (home), `highlight` (image card on the Menu page), `isSample`, `sortOrder`, `published`.

**`reservations`**
- `reference` (CK-yymmdd-XXXX), `guests`, `date` (YYYY-MM-DD), `time` (HH:MM).
- `name`, `email`, `phone`, `requests?`.
- `status` (`new | confirmed | declined | archived`), `adminNotes?`, `fingerprint`.

**`inquiries`** (Contact form)
- `reference` (CM-…), `name`, `email`, `subject`, `message`.
- `status` (`new | responded | archived`), `adminNotes?`, `fingerprint`.

**`settings`** (singleton)
- Identity and address.
- `phone`, `phoneVerified`, `email`.
- `mapEmbedUrl`: seeded with an address-search embed, with no invented coordinates.
- `heroAutoplay`, `heroIntervalSeconds` (6–8), `experiencePan`.
- `maxGuests` (20).
- `hours[7]`, `hoursVerified`, `socialLinks[]`, `footerNote`.

**`content_blocks`** (polymorphic `type`)

| Type | Seeded | Extra fields |
|---|---|---|
| `page_copy` | keyed | up to 3 photo slots |
| `hero_slide` | 3 | |
| `experience_point` | 4 | |
| `philosophy_item` | 5 | |
| `prep_step` | 3 | |
| `atmosphere_item` | 4 | |
| `occasion` | 4 | `cta` |
| `highlight` | 3 | `emphasis`, `cta`, `href` |

**`gallery_items`**
- `title`, `category`: Seafood & Dishes, Restaurant Interiors, Food Preparation or Dining Moments.
- `imageUrl?`, `alt`, `rows`, `cols`, `tint`, `featuredOnHome`, `sortOrder`, `published`.

**`admin_users`**
- JWT admin, seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Validation (mirrors the design's form scripts exactly)

### Reservation inquiry

| Field | Rule | Message |
|---|---|---|
| Number of guests | integer 1–`maxGuests` (20) | "Choose the number of guests (1 to 20)." |
| Preferred date | required, valid | "Choose a preferred date." |
| Preferred date | not in the past | "Choose a date from today onwards." |
| Preferred time | required HH:MM | "Choose a preferred time." |
| Full name | ≥ 2 characters | "Please enter your full name." |
| Email | required | "Please enter your email address." |
| Email | `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` | "Enter an email address like name@example.com." |
| Phone | **required** | "Please enter a phone number so our team can reach you." |
| Phone | 10–15 digits | "Enter a phone number with 10 to 15 digits." |
| Special requests | optional, ≤ 600 | "Please keep special requests under 600 characters." |

Server only, once hours are verified:
- A closed day returns "We’re closed on Mondays. Please choose another date."
- A time outside opening hours returns "Please choose a time between 5:00 PM and 9:00 PM." (example times).

### Contact

| Field | Rule | Message |
|---|---|---|
| Name | ≥ 2 characters | "Please enter your name." |
| Email | as above | as above |
| Subject | ≥ 2 characters | "Please add a short subject." |
| Message | 10–1,500 characters | "Please write a short message (at least 10 characters)." / "Please keep your message under 1,500 characters." |

### Spam protection (both forms)

- Hidden honeypot field `website`.
- Per-IP rate limit: `RESERVATION_RATE_LIMIT` / `INQUIRY_RATE_LIMIT` per 10 minutes.
- An identical submission within 10 minutes returns 409.

## Design-only behaviour NOT reproduced

- The "Form state" setting (forced success or error, with sample "Jordan Lee" data) and the "Not sent yet" no-backend state are replaced by the real API response.
- The "Show client notes" setting is replaced by clearing each content block's `clientNote` in the admin.
- The illustrated map preview is replaced by the live Google Maps embed from Settings. The illustrated map is kept only as a fallback when the embed URL is cleared.
