# Coastal Kitchen: website

A working version of the Coastal Kitchen design, a seafood restaurant at 8945 Forest Road, Santa Rosa, California. It includes:

- **Seven public pages:** Home, Menu, About, Experience, Gallery, Reservations and Contact.
- **Menu:** a sectioned menu with a sticky section bar, dietary markers and a "Price to be supplied" fallback.
- **Reservation inquiry form:** saves real requests for staff to confirm. It is not an instant booking.
- **Contact form:** saves messages to the database.
- **Gallery:** category filters and a lightbox.
- **Admin panel:** reservations, messages, dishes, menu sections, gallery, page content and settings.

| Part | Stack | Folder |
|---|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript | `frontend/` |
| API | NestJS 10, TypeORM, class-validator, JWT | `backend/` |
| Database | SQLite 3 | `database/app.sqlite` |

Other folders and files:

- `design-source/` holds the seven original `.dc.html` design artboards.
- `DATA-MODEL.md` lists everything taken from those designs: routes, seed copy, validation rules and placeholder flags.

---

## Quick start

Requires Node.js 18.18+ (20 LTS recommended).

```bash
npm run install:all        # root, backend and frontend dependencies
npm run dev                # API on :4000, website on :3000
```

`backend/.env` and `frontend/.env.local` already hold development values. See the matching `.env.example` files.

| | URL |
|---|---|
| Website | http://localhost:3000 |
| Admin | http://localhost:3000/admin/login |
| API | http://localhost:4000/api |

On first start the API creates the tables, seeds the content from the design, and creates the admin account:

```
Email:    admin@coastalkitchen.local
Password: CoastalKitchen!2026
```

- **Different credentials:** set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` before the first start.
- **Change the password later:** go to **Admin → Settings → Change password**. Do this before going live.
- **Start over with a fresh database:** run `npm run db:reset`, then restart the API.

### Other scripts

| Command | What it does |
|---|---|
| `npm run build` | Builds the API (`backend/dist`) and the website (`frontend/.next`). |
| `npm start` | Runs both production builds. |
| `npm run typecheck` | Runs `tsc --noEmit` on the backend and frontend. |
| `npm run test:rules` | Checks that browser-side and API form validation agree. See [Form validation](#form-validation). |

---

## How reservations work

**The online form sends an inquiry, not a booking.** No table is held automatically, and **no email is sent automatically**, because no mail service was specified.

1. **The guest sends a request.** They enter party size, date, time, name, email, phone and optional special requests. The site shows *"Inquiry received. Awaiting confirmation."* with a reference number, and says the table is not booked yet.
2. **The request appears in Admin → Reservations** with the status **New**. The dashboard counts it under *Reservations to confirm* and lists it under *Next to confirm*, soonest date first.
3. **Staff check availability and contact the guest.** Open the request to:
   - **Email: confirm your table.** Opens your email app with a confirmation message already written: the guest's name, date, time, party size and reference, plus the restaurant's phone number and address. Edit it, then send.
   - **Email: can't accommodate.** Opens a polite decline with a space to suggest another time.
   - **Call.** Tap-to-call the guest's number.
4. **Staff set the status:** **Confirm**, **Decline** or **Archive**. Changing the status does not notify the guest; the email or call does that. Use *Internal notes* for things like "left voicemail 3:10 PM".

You can filter the list by status, date (upcoming, today, past, or any), a date range and a search term, then export it to CSV.

Other rules on the form:

- **Party size:** the form accepts 1 up to **Settings → Largest party for the online form** (default 20, allowed range 2–50). Larger groups are asked to call.
- **Opening hours:** times are checked against them only once the hours are entered and marked confirmed. Until then any time is accepted, and staff check it when they confirm.
- **Spam and duplicates:** a hidden spam-trap field and a per-IP rate limit (`RESERVATION_RATE_LIMIT`, default 5 per 10 minutes) protect the form. An exact duplicate submission is refused.
- **If sending fails:** the guest's details stay in the form, and they're offered a phone link and a pre-filled email instead. There is never a fake success screen.

Contact-form messages work the same way and arrive in **Admin → Messages**. Statuses there are New, Responded and Archived, and there's a pre-filled reply email.

---

## Launch checklist (for Coastal Kitchen to supply or confirm)

The site never invents facts. Each item below stays a clearly marked placeholder until the restaurant supplies or confirms it. **Admin → Dashboard → Launch checklist** tracks each one live.

1. **Phone number.**
   - The supplied number, **+1 (856) 382-1942**, is used exactly as given.
   - **856 is a southern New Jersey area code; Santa Rosa numbers use 707.** Confirm the number with the restaurant.
   - Then tick *Phone number verified* in **Settings**.
2. **Opening hours.**
   - None were supplied. The site says "Opening hours to be confirmed. Please call before visiting." and every day shows "Hours to confirm".
   - Enter the hours in **Settings** and tick *These hours are confirmed by the restaurant*.
   - The site then shows them, adds a live "Open now / Closed now" status, and limits reservation times to open hours.
3. **Dishes and prices.**
   - All **32 seeded dishes are Sample placeholders** ("Sample Seafood Dish No. 1" and so on) across six sections: Seafood, Appetizers, Main Courses, Sides, Desserts and Beverages.
   - In **Admin → Dishes**:
     - Replace each sample with a real dish and untick *Sample*.
     - Enter the price in dollars (e.g. `28.50`), or use a price note such as "Market price". Until then the site shows "Price to be supplied".
     - Add dietary markers (GF, V, VG, DF) and labels (Popular, Chef's pick, Seasonal, New) only where the kitchen has confirmed them.
   - Filter by *Samples* or *No price yet* to see what's left.
   - Rename, reorder or add sections in **Admin → Menu sections**.
4. **Photos.** Every image is a labelled, tinted placeholder. Upload genuine photographs of Coastal Kitchen only, never stock images presented as the restaurant. This covers:
   - homepage hero slides and page heroes (**Page content**)
   - dishes (**Dishes**) and section photos (**Menu sections**)
   - the 14 gallery items (**Gallery**); the first five marked *Show in the homepage collage* appear on Home
   - section photos on Home, About and Experience (**Page content**)
5. **Story and copy.**
   - The About story and some sections carry dashed "Client to supply" notes.
   - Replace the copy in **Page content**, then clear the note.
   - Don't add founding dates, chef names, awards, ratings, testimonials, or sourcing, sustainability or organic claims unless the restaurant has supplied and verified them.
6. **Social links.** None were supplied. Add official accounts only, in **Settings → Social links**. They then appear in the footer.
7. **Before going live:**
   - change the admin password;
   - set a long random `JWT_SECRET`;
   - set `CORS_ORIGINS` and `NEXT_PUBLIC_API_URL` to the real domains (see [Production notes](#production-notes)).

---

## Admin panel

Sign in at `/admin/login`. Every list has search, filters, and loading, empty and error states. Forms validate before saving and show the server's field errors.

| Section | What it manages |
|---|---|
| **Dashboard** | Reservations to confirm, today, upcoming and new messages. Also shows the next requests to confirm and the launch checklist. |
| **Reservations** | Reservation inquiries. Filters: status, when, date range, search and sort. Opens a detail drawer with Confirm, Decline and Archive actions, pre-filled emails, tap-to-call and notes. CSV export. |
| **Messages** | Contact-form messages: status, reply email, notes, CSV export. |
| **Dishes** | Name, description, price (USD) or price note, dietary markers, label, homepage feature and menu highlight, Sample flag, photo, order and published state. |
| **Menu sections** | Name, short line, Menu-page introduction, layout (photo left, right, two photos or no photo), tint, photo and order. A section shows on the site only while it has published dishes. |
| **Gallery** | Photos by category: Seafood & Dishes, Restaurant Interiors, Food Preparation and Dining Moments. Also tile size and homepage collage flag. |
| **Page content** | Every heading and paragraph, plus hero slides, experience points, About values and kitchen steps, Experience atmosphere, occasions and highlights. Wrap words in `*asterisks*` for the italic accent. |
| **Settings** | Restaurant details, map embed, opening hours, largest online party, motion (hero autoplay and interval, Experience pan), social links, footer note and password. |

Uploads (JPG, PNG, WebP or AVIF, up to 8 MB) are stored in `backend/uploads/` and served from `/uploads/…`.

---

## Form validation

The reservation and contact forms check input in the browser for instant feedback (`frontend/lib/validation.ts`). The API applies the same rules again and stays authoritative:

- `backend/src/reservations/reservation-rules.ts`
- `backend/src/inquiries/inquiry-rules.ts`

`npm run test:rules` runs both sets against 50,000 generated inputs and fails if any error message differs. If you change a rule, change it in both places and re-run.

---

## Structure

```
backend/                 NestJS API
  src/menu/              menu sections and dishes (public + admin)
  src/reservations/      reservation inquiries, rules, stats, CSV
  src/inquiries/         contact messages, rules, stats, CSV
  src/content/           page copy and repeating content blocks
  src/gallery/           gallery items
  src/settings/          restaurant settings, hours, open-now status
  src/admin-auth/        admin login (JWT), password change
  src/seed/              first-run seed data from the design
frontend/                Next.js site and admin
  app/(site)/            the seven public pages
  app/admin/             admin login and protected screens
  components/            site and admin components
  lib/                   API client, types, validation, admin helpers
database/app.sqlite      created on first API start
scripts/                 rule-parity check
design-source/           original design artboards
```

---

## API overview

The base path is `/api`. Admin routes need `Authorization: Bearer <token>` from `POST /api/admin-auth/login`.

| Public | |
|---|---|
| `GET /settings` | Restaurant details, hours display, open-now status |
| `GET /content`, `GET /content/page-copy` | Content blocks and page copy |
| `GET /menu`, `GET /menu/featured` | Published menu and homepage dishes |
| `GET /gallery`, `GET /gallery/home` | Gallery and homepage collage |
| `POST /reservations` | Reservation inquiry (201 with reference, `status: "awaiting_confirmation"`) |
| `POST /inquiries` | Contact message |

| Admin (`/admin/…`) | |
|---|---|
| `reservations` | List and filter, `stats`, `export.csv`, `GET`, `PATCH` (`status`, `adminNotes`), `DELETE` |
| `inquiries` | List and filter, `stats`, `export.csv`, `GET`, `PATCH`, `DELETE` |
| `menu-categories`, `menu-items` | CRUD, `/:id/image`; `menu-items/counts` |
| `content`, `gallery` | CRUD, `/:id/image` (content supports `?slot=image2Url`); `content/reorder` |
| `settings` | `GET`, `PUT` |

Validation errors return `400` with `fieldErrors: { field: message }`.

---

## Production notes

- **Secrets:** set a long random `JWT_SECRET` and change the seeded admin password.
- **Domains:**
  - backend `CORS_ORIGINS`: the website's origin;
  - frontend `NEXT_PUBLIC_API_URL`: the public API URL;
  - frontend `API_URL` (optional): an internal URL for server-side rendering.
- **Timezone:** `SHOP_TIMEZONE` (default `America/Los_Angeles`) drives "today", open-now and the upcoming/past split.
- **Back up** `database/app.sqlite` and `backend/uploads/`. Together they are the whole site's data.
- **Email:** none is sent automatically. To add automatic confirmation emails later, connect a mail provider in `ReservationsService`. The admin's pre-filled emails work without one.
