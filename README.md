# Udomtong Farm

The promotional website of Udomtong Farm, Chaiyaphum, Thailand: a bilingual (Thai and English) introduction to the farm and a collection of the rare animals and plants bred there.

Built with Next.js (App Router), Tailwind CSS, Supabase and the Claude API.

## What the site does

- **Home, About and Visit pages** that present the farm: about 11 rai, free to enter, with homestay accommodation and a café, plus hours, map, directions and FAQ.
- **Collection** of every species, with search across Thai, English and scientific names, and filters for department, group and IUCN status. Each species has its own page.
- **Chat assistant** that answers visitors' questions about the farm, its animals and plants, and how to get in touch. It runs on Claude Haiku.
- **Sign-in with Google** for visitors who want to keep a saved list of species. There are no passwords on this site, so none can be lost.
- **Admin dashboard** for changing photographs and information: every species, and the farm's phone number, Facebook link, map link and address.
- Thai and English versions of every page under `/th` and `/en`, with a sitemap, `robots.txt`, share previews and structured data for search engines.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

The site runs without any configuration. It then reads the species from `src/data/species.json`; sign-in, saved lists and the admin area are switched off, and the chat button is hidden. Each part is switched on by its own settings, described below.

Copy `.env.example` to `.env.local` for local settings. On the hosting provider, add the same values as environment variables and redeploy.

## Chat assistant

1. Create an API key in the [Anthropic Console](https://console.anthropic.com/) under **API keys**.
2. Set it as `ANTHROPIC_API_KEY`. The chat button then appears on every page.

The key is a secret. Never commit it, and never give it a name starting with `NEXT_PUBLIC_`.

What the assistant knows is built in `src/lib/chat/knowledge.ts` from the same text the pages show: the farm story, visiting details, FAQ, contact details and the species list. Updating those updates its answers. Its instructions are at the top of that file.

Every question costs a small amount. Limits in `src/lib/chat/config.ts` cap message length, conversation length and requests per visitor, but the per-visitor limit is kept in memory and is only a first line of defence. **Set a monthly spending limit in the Anthropic Console** so that misuse cannot run up a bill.

## Supabase (sign-in, saved lists, admin)

1. Create a project at [supabase.com](https://supabase.com).
2. In the project's **SQL Editor**, run `supabase/schema.sql`, then `supabase/seed.sql`. The first creates the tables, access rules and photo storage. The second loads the starting collection.
3. Set these from **Project Settings → API**:

   ```ini
   NEXT_PUBLIC_SITE_URL=https://your-site-address
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. Switch on Google sign-in:
   - In [Google Cloud Console](https://console.cloud.google.com/), create an **OAuth client ID** of type *Web application*. Under **Authorized redirect URIs** add `https://xxxx.supabase.co/auth/v1/callback`, using your Supabase project address.
   - In Supabase, open **Authentication → Sign In / Providers → Google**, enable it, and paste the client ID and client secret from Google.
   - In **Authentication → URL Configuration**, set **Site URL** to the site's address and add `https://your-site-address/auth/callback` to **Redirect URLs**. For local development also add `http://localhost:3000/auth/callback`.
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
| Farm story, homestay and café text, hours, FAQ, all interface text | `src/i18n/dictionaries/th.ts` and `en.ts` |
| Founder profile, farm area | `src/lib/site.ts` |
| Thai names for groups | `TAG_TH` in `src/lib/species/helpers.ts` |
| Colours and type | `src/app/globals.css` |

Before Supabase is connected, species live in `src/data/species.json` and contact details in `src/lib/site.ts`. After editing the JSON file, run `npm run db:seed-sql` to regenerate `supabase/seed.sql`.

Published pages are static and are rebuilt whenever an admin saves a change. Changes made directly in the Supabase dashboard appear within an hour.

## Project structure

```text
src/
  app/
    [lang]/          Pages, one folder per route
      (auth)/login/  Sign in with Google
      account/       Member account page
      admin/         Admin dashboard
    api/chat/        The chat assistant's endpoint
    auth/callback/   Where Google sends visitors back after sign-in
    sitemap.ts, robots.ts
  components/        Shared interface pieces, grouped by area
  i18n/              Languages and dictionaries
  lib/
    chat/            Chat settings, what the assistant knows, request limits
    species/         Types, helpers and data access for the collection
    supabase/        Supabase clients for the server, browser and proxy
    auth.ts          Who is signed in, and admin checks
    settings.ts      Contact details an admin can change
    site.ts          Farm facts and starting contact details
  data/species.json  The starting collection
  proxy.ts           Adds the language to addresses and guards member pages
supabase/            Database schema and seed data
public/              Photographs and icons
```

## Access rules

Access is enforced in the database with row level security, defined in `supabase/schema.sql`:

- Anyone can read published species and the farm's contact details.
- Members can read and change only their own profile name and saved list.
- Only admins can change species, upload photographs or edit the farm's details. Admins are appointed in the SQL Editor.

## Deployment

Deploy to any host that runs Next.js. On Vercel, set the project's framework preset to **Next.js** and add the environment variables above.
