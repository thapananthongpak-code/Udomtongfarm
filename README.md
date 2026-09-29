# Udomtong Farm Nature Journal

A bilingual (Thai and English) field guide to the rare animals and plants cared for at Udomtong Farm, Chaiyaphum, Thailand.

The site is fully static: there is no backend, database, login or admin area. All content ships with the build, so it can be hosted on any static host.

## Features

- **Encyclopedia** with search across Thai, English and scientific names, filters for category, collection and IUCN status, four sort orders, grid and list views, and pagination. Every filter is kept in the URL, so filtered views can be bookmarked and shared.
- **Article pages** with a reading progress bar, IUCN status scale, field-notes sidebar, sources, previous and next navigation, related species, adjustable text size, print styles, and sharing via link, Facebook, LINE, X or QR code.
- **Species of the day** on the home page, plus a conservation watch list and collections.
- **Gallery** with a keyboard-navigable lightbox.
- **Compare** any two species side by side.
- **Reading list and history** saved in the browser, with no account needed.
- **Command palette** search (`Ctrl K`, `Cmd K` or `/`).
- Light and dark themes, Thai and English, responsive down to 360px, and accessible markup (skip link, keyboard support, reduced-motion support).
- SEO: per-page titles and share tags, JSON-LD, and a `sitemap.xml`, `robots.txt` and RSS `feed.xml` generated at build time.
- Installable PWA with offline reading.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build to dist/
npm run preview  # serve the production build locally
npm run lint
```

## Editing content

| What | Where |
| --- | --- |
| Species articles | `src/data/animals.ts`, `src/data/plants.ts` |
| Species photos | `public/images/animals/`, `public/images/plants/` |
| Phone, address, map, founder profile | `src/lib/site.ts` |
| All interface text (Thai and English) | `src/lib/i18n.ts` |
| Editor's picks on the home page | `FEATURED_IDS` in `src/lib/species.ts` |
| Thai names for collection tags | `TAG_TH` in `src/lib/species.ts` |

To add a species, add an entry to the relevant data file with a unique `id`, put its photo in `public/images/`, and set `status` to an IUCN code (`LC`, `NT`, `VU`, `EN` or `CR`) if one applies. It will appear in the encyclopedia, gallery, search, sitemap and RSS feed automatically.

## Project structure

```
src/
  components/   Header, footer, cards, search palette, modal, shared bits
  pages/        Home, Encyclopedia, Article, Gallery, Compare, Saved, About, Visit, NotFound
  lib/          Species helpers, translations, site facts, safe storage
  store/        Preferences, reading list and history, UI state (Zustand)
  hooks/        Per-page document metadata
  data/         Species content
public/         Images, icons, manifest, service worker
```

## Deployment

The build output in `dist/` is a single-page app. `vercel.json` rewrites routes to `index.html`, and `railway.toml` or `nixpacks.toml` serve `dist/` with `serve -s`. No environment variables are required.
