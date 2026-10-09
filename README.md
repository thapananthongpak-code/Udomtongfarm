# Udomtong Farm

The promotional website of Udomtong Farm, Chaiyaphum, Thailand: a bilingual (Thai and English) introduction to the farm and a collection of the rare animals and plants bred there.

Built with React, Vite, Tailwind CSS and Supabase. The chat assistant uses the Gemini API through one small Vercel function.

## What the site does

- **Home, About and Visit pages** that present the farm: about 11 rai, free to enter, with activities, a four-room homestay and a café, plus hours, map, directions and FAQ.
- **Collection** of every species, with search across Thai, English and scientific names, and filters for department, group and IUCN status. Each species has its own page.
- **Chat assistant** that answers visitors' questions about the farm, its animals and plants, and how to get in touch. It runs on Google Gemini.
- **Sign-in with Google** for visitors who want to keep a saved list of species. There are no passwords on this site, so none can be lost.
- **Admin dashboard** for changing photographs and information: every species, and the farm's phone number, Facebook link, map link and address.
- Thai and English versions of every page under `/th` and `/en`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build to dist/
npm run preview    # serve the built site locally
npm run lint
```

The site runs without any configuration. It then shows the species in `src/data/species.ts`; sign-in, saved lists and the admin dashboard are switched off, and the chat button is hidden. Each part is switched on by its own settings, described below.

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
2. In the project's **SQL Editor**, run `supabase/schema.sql`, then `supabase/seed.sql`. The first creates the tables, access rules and photo storage. The second loads the starting collection.
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
| Phone, Facebook link, map link, address | Admin dashboard → Farm details |
| Farm story, activities, homestay and café text, hours, FAQ, all interface text | `src/i18n/dictionaries/th.ts` and `en.ts` |
| Founder profile | `src/lib/farm.ts` |
| Thai names for groups | `TAG_TH` in `src/lib/species/helpers.ts` |
| Colours and type | `src/index.css` |

Before Supabase is connected, species live in `src/data/species.ts` and contact details in `src/lib/farm.ts`. After editing the species file, run `npm run db:seed-sql` to regenerate `supabase/seed.sql`.

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
    admin.ts         Checking and saving what an admin types
    supabase.ts      The Supabase client
    species/         Types and helpers for the collection
  data/species.ts    The starting collection
api/
  chat.ts            The chat assistant's endpoint (a Vercel function)
  _lib/              What the assistant knows, and request limits
supabase/            Database schema and seed data
public/              Photographs and icons
```

## Access rules

The admin pages are hidden from everyone who is not an admin, but that is only for tidiness. The real protection is row level security in the database, defined in `supabase/schema.sql`:

- Anyone can read published species and the farm's contact details.
- Members can read and change only their own profile name and saved list.
- Only admins can change species, upload photographs or edit the farm's details. Admins are appointed in the SQL Editor.

## Deployment

The project is set up for Vercel with the **Vite** framework preset. `vercel.json` sends every address except `/api/*` to `index.html`, and Vercel turns `api/chat.ts` into a serverless function automatically.

Pushing to the `main` branch publishes to production. Pushing any other branch creates a preview deployment.

## Limitations

- The site is a single-page app, so a link shared on LINE or Facebook shows the same preview image and title for every page.
- `sitemap.xml` is written at build time from `src/data/species.ts`. Species added later in the dashboard appear on the site straight away, but not in the sitemap until that file is updated.
