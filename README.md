# Udomtong Farm

The promotional website of Udomtong Farm, Chaiyaphum, Thailand: a bilingual (Thai and English) introduction to the farm and a collection of the rare animals and plants bred there.

Built with React, Vite, Tailwind CSS and Supabase. The chat assistant uses the Gemini API through one small Vercel function.

## What the site does

- **Home, About and Visit pages** that present the farm: free to enter, with activities, a four-room homestay and a café, plus hours, map, directions and FAQ.
- **Café page** with the drinks menu, grouped into coffee, cocoa, tea and other drinks.
- **Gallery** with four tabs: animals, plants, activities and rates. The animals and plants tabs search across Thai, English and scientific names and filter by group; each species has its own page. Activities are shown with a photograph, and the rates tab is a price list in which an empty price reads "Ask the farm" and zero reads "Free".
- **Chat assistant** that answers visitors' questions about the farm, its animals and plants, and how to get in touch. It runs on Google Gemini.
- **Sign-in with Google** for visitors who want to keep a saved list of species. There are no passwords on this site, so none can be lost.
- **Admin dashboard** for changing photographs and information: every species, the café menu, the farm's phone number, Facebook link, map link and address, and the site's main texts in Thai and English, and the activities and rates.
- Thai and English versions of every page under `/th` and `/en`.
- **Text size control** (normal, large, extra large) and **colour contrast control** (the site's colours, black text on white, white text on black) in the header, both remembered in the browser, and markup that works with screen readers.
- **QR code on every species page**, which opens that page on the phone that scans it. In the admin dashboard the code appears as soon as a new entry is saved, with downloads (PNG, SVG) and a sheet of every code to print as signs.
- **Hover and press feedback** on buttons, menus and cards, switched off for customers whose device asks for less motion.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build to dist/
npm run preview    # serve the built site locally
npm run lint
```

The site runs without any configuration. It then shows the species in `src/data/species.ts` and the sample menu in `src/data/menu.ts`; sign-in, saved lists and the admin dashboard are switched off, and the chat button is hidden. Each part is switched on by its own settings, described below.

Copy `.env.example` to `.env.local` for local settings. Real keys go in `.env.local` only: `.env.example` is a template that is published with the code. On Vercel, add the same values under **Settings → Environment Variables** and redeploy.

## Chat assistant

1. Create an API key in [Google AI Studio](https://aistudio.google.com/apikey).
2. Set it as `GEMINI_API_KEY`. The chat button then appears on every page.

The key is a secret. Never commit it, and never give it a name starting with `VITE_`: anything with that prefix is built into the pages and can be read by every visitor.

The key is used only by `api/chat.ts`, which Vercel runs on its servers. `npm run dev` runs the same file locally, so the chat works there too. `npm run preview` only serves the built pages, so the chat button stays hidden in that mode.

What the assistant knows is built in `api/_lib/knowledge.ts` from the same text the pages show: the farm story, activities, homestay, visiting details, FAQ, contact details and the species list. Updating those updates its answers. Its instructions are at the top of that file. The model is named in `api/chat.ts`.

Every question costs a small amount. Limits in `src/lib/chat-limits.ts` cap message length, conversation length and requests per visitor, but the per-visitor limit is kept in memory and is only a first line of defence. **Check the quota and billing settings for the key in Google AI Studio** so that misuse cannot run up a bill.

## Supabase (sign-in, saved lists, admin)

1. Create a project at [supabase.com](https://supabase.com).
2. In the project's **SQL Editor**, run `supabase/schema.sql`, then `supabase/seed.sql`. The first creates the tables, access rules and photo storage. The second loads the starting collection and a sample café menu. Both are safe to run again after an update to this code: existing data is kept.

   A database created before October 2026 also needs `supabase/update-2026-10.sql` run once. It adds the "new" badge and the visit counts, clears the photographs that were removed from the site, and cuts the conservation sentences from the descriptions.
3. Set these from **Project Settings → API**:

   ```ini
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   ```

4. Switch on Google sign-in:
   - In [Google Cloud Console](https://console.cloud.google.com/), create an **OAuth client ID** of type *Web application*. Under **Authorized redirect URIs** add `https://xxxx.supabase.co/auth/v1/callback`, using your Supabase project address.
   - In Supabase, open **Authentication → Sign In / Providers → Google**, enable it, and paste the client ID and client secret from Google.
   - In **Authentication → URL Configuration**, set **Site URL** to the site's address and add `https://your-site-address/auth/callback` to **Redirect URLs**. For local development also add `http://localhost:5173/auth/callback`.
5. Sign in on the site with Google once, then make that account an admin by running this in the SQL Editor:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

   The dashboard is then linked from the account page. Repeat for each person who should be an admin.

## Editing content

| What | Where |
| --- | --- |
| Species information and photographs | Admin dashboard → Animals and plants |
| Café menu: drinks, prices and photographs | Admin dashboard → Café menu |
| Activities, their photographs, and rates | Admin dashboard → Activities and rates |
| QR codes: download or print | Admin dashboard → Animals and plants → open an entry, or "QR code signs" |
| Phone, Facebook link, map link, address | Admin dashboard → Farm details |
| Site name, tagline, home page heading, farm story, founder profile, activities, homestay details, hours, FAQ, footer and privacy policy | Admin dashboard → Site texts |
| Every other text, such as button and menu labels | `src/i18n/dictionaries/th.ts` and `en.ts` |
| Thai names for groups | `TAG_TH` in `src/lib/species/helpers.ts` |
| Colours and type | `src/index.css` |

Before Supabase is connected, species live in `src/data/species.ts`, the sample café menu in `src/data/menu.ts`, the activities and rates in `src/data/services.ts`, and contact details in `src/lib/farm.ts`. After editing any of the three data files, run `npm run db:seed-sql` to regenerate `supabase/seed.sql`.

**Prices** of activities and rates are whole baht. An empty price shows "Ask the farm" and the chat assistant says the price has not been published; `0` means free. Only entry to the farm is seeded as free.

**Conservation status** (the IUCN category) is no longer shown on the site or given to the chat assistant: there is no badge, filter, sort or "threatened" section, and the sentences that stated it have been cut from the descriptions. The `status` column is kept in the database and in the admin form.

**Photographs.** The photographs that first shipped with the site have been removed, so an entry has no photo until one is uploaded in the admin dashboard. Until then a card shows an empty frame with a small bird or leaf, and the entry's own page uses the full width for its text.

**QR codes** open `<site address>/species/<id>`, with no language so that the site opens in the phone's own. A printed sign therefore keeps working for as long as the site address (`VITE_SITE_URL`) and the entry's web address name (its id, which cannot be changed in the form) stay the same. Choose the address before printing signs. A draft entry's code opens "not found" until the entry is published.

**The "new" badge.** An entry added through the dashboard carries a "New" badge for 30 days, is listed first in the gallery, and appears in the "New arrivals" band on the home page (the three most recent). The form has a choice to keep the badge on or switch it off. The starting collection does not carry the badge.

**Site texts** saves only what differs from the wording in the two dictionary files, in the `site_content` table. Emptying a box and saving puts the dictionary's wording back. The list of texts that can be edited is `CONTENT_GROUPS` in `src/lib/content.ts`; lists such as the FAQ keep the number of entries they have in the dictionaries.

The note at the top of the Café page, which says the café is getting ready to open, is `cafe.notice` in the two dictionary files.

## Project structure

```text
index.html           The single page the browser loads
src/
  main.tsx           Starts the app
  router.tsx         Which address shows which page
  pages/             One file per page; admin/ holds the dashboard
  components/        Shared interface pieces, grouped by area
  state/             Data shared by every page: the collection, and who is signed in
  i18n/              Languages and dictionaries
  lib/
    farm.ts          Farm facts and starting contact details
    content.ts       Which texts an admin can change, and putting them in place
    services.ts      Types and helpers for activities and rates
    admin.ts         Checking and saving what an admin types
    supabase.ts      The Supabase client
    species/         Types and helpers for the collection
  data/species.ts    The starting collection
  data/services.ts   The starting activities and rates
api/
  chat.ts            The chat assistant's endpoint (a Vercel function)
  _lib/              What the assistant knows, and request limits
supabase/            Database schema and seed data
public/              Photographs and icons
```

## Access rules

The admin pages are hidden from everyone who is not an admin, but that is only for tidiness. The real protection is row level security in the database, defined in `supabase/schema.sql`:

- Anyone can read published species, activities and rates, the farm's contact details and the site's texts.
- Members can read and change only their own profile name and saved list.
- Only admins can change species, activities and rates, upload photographs, or edit the farm's details and the site's texts. Admins are appointed in the SQL Editor.

## Deployment

The project is set up for Vercel with the **Vite** framework preset. `vercel.json` sends every address except `/api/*` to `index.html`, and Vercel turns `api/chat.ts` into a serverless function automatically.

Pushing to the `main` branch publishes to production. Pushing any other branch creates a preview deployment.

## Accessibility

- **Text size:** the buttons in the header (and in the menu on narrow screens) set the root font size to 100%, 112.5% or 125%. Every size in the stylesheet is in `rem`, so everything follows. Keep it that way: a size written in `px` would ignore the control. The choice is stored under `text-size` in the browser, and a small script in `index.html` applies it before the page is drawn.
- **Page changes:** the site is a single-page app, which browsers do not announce to screen readers. `RouteAnnouncer` in `src/components/Layout.tsx` reads out the new page's title and moves keyboard focus to the page content. Changing a filter does not do this.
- **Chat window:** replies are announced once, when complete, not word by word. Pressing Escape closes the window and returns focus to the button that opened it.
- **Contrast modes:** `data-contrast="light"` and `"dark"` on `<html>` swap the colour tokens at the top of `src/index.css`, so every part of the site follows. Text is 13:1 or better and borders are the full text colour. Use the tokens and never a fixed colour for text or borders, or a new part of the site will not follow the mode. QR codes are the exception: they stay black on white so that phones can read them. A small script in `index.html` applies the saved choice before the page is drawn.
- **Motion:** hover, press and entry animations are CSS, in the "Motion" section of `src/index.css`, inside a `prefers-reduced-motion: no-preference` query. Keep new animations there.
- **Colours:** text colours meet 4.5:1 and the borders of fields and buttons meet 3:1 (`--control` in `src/index.css`). Check a new colour before using it for text.
- **Language:** the page language is set on `<html>`, and scientific names are marked `lang="la"` so they are not read in the wrong voice.

New pages should keep the heading order (one `h1`, then `h2`, then `h3`), label every field, and give images a useful `alt` or an empty one when the text next to them already says it.

## Limitations

- The site is a single-page app, so a link shared on LINE or Facebook shows the same preview image and title for every page.
- That preview title, and the title shown for a moment while a page loads, come from `index.html`. A site name changed in Admin → Site texts does not reach them: edit `index.html` as well.
- `sitemap.xml` is written at build time from `src/data/species.ts`. Species added later in the dashboard appear on the site straight away, but not in the sitemap until that file is updated.
