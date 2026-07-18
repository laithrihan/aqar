# Aqar

A bilingual real-estate web app for browsing, buying, and renting homes. Built with React, Clean Architecture, and Domain-Driven Design.

> **Backend:** The app currently uses mock JSON. A real **Laravel** API will be wired in soon; only the infrastructure layer needs to change.

## Features

- **Home** — panorama hero, property search filters, and featured homes
- **Buy / Rent** — listing grid with sorting, filters, and Google Maps
- **Property detail** — gallery, amenities, tour player, nearby map, and related homes
- **About** — brand story, values, and CTA
- **Contact** — contact info and message form
- **i18n** — English and Arabic (`en` / `ar`)

Auth pages (`/login`, `/signup`) are placeholders for now.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, Tailwind CSS, shadcn/ui |
| Routing | React Router |
| Server state | TanStack Query |
| Client state | Zustand |
| Forms | React Hook Form |
| Maps | Google Maps (`@vis.gl/react-google-maps`) |
| i18n | i18next / react-i18next |
| Build | Vite 8, TypeScript |
| Deploy | Vercel (SPA rewrites) |
| Backend (soon) | Laravel API |

## Architecture

The codebase follows Clean Architecture and DDD-style layering:

```
src/
├── app/               # Router, layouts, providers
├── domain/            # Entities, types, pure domain logic
├── infrastructure/    # Data access (mock JSON now → Laravel API soon)
├── presentation/      # Pages, components, hooks, stores
├── shared/            # i18n, utilities
└── components/ui/     # Shared UI primitives (shadcn)
```

- **Domain** — business types and rules with no UI or HTTP details
- **Infrastructure** — repositories that fetch data (mock JSON today; will call the Laravel API soon)
- **Presentation** — React UI wired with TanStack Query hooks and Zustand stores

## Getting started

### Prerequisites

- Node.js **20+**
- npm

### Install

```bash
npm install
```

### Environment

Copy the example env file and add a Google Maps API key (required for map views):

```bash
cp .env.example .env.local
```

```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
# Optional — Advanced Markers map ID
# VITE_GOOGLE_MAPS_MAP_ID=
```

Enable the **Maps JavaScript API** in Google Cloud Console for your key.

### Run

```bash
npm run dev
```

### Other scripts

```bash
npm run build    # Typecheck + production build
npm run preview  # Preview the production build
npm run lint     # ESLint
```

## Mock API → Laravel backend

Backend endpoints are not available yet. Repositories load temporary JSON from `public/mock/` as a stand-in until the **Laravel** backend is ready:

| File | Used for |
|------|----------|
| `carousel-slides.json` | Home panorama |
| `bento-homes.json` | Featured homes |
| `property-search-filters.json` | Search filter options |
| `rent-listings.json` | Buy / rent listings |
| `property-details.json` | Property detail pages |
| `contact-info.json` | Contact page info |

When the Laravel API is connected, update the corresponding repositories under `src/infrastructure/` — domain and presentation layers stay the same.

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/buy` | Buy listings |
| `/rent` | Rent listings |
| `/homes/:propertyId` | Property detail |
| `/about` | About |
| `/contact` | Contact |
| `/login` | Login (placeholder) |
| `/signup` | Sign up (placeholder) |

## Path alias

Imports use the `@/` alias mapped to `src/`:

```ts
import { HomePage } from '@/presentation/pages/HomePage'
```

## License

Private project — all rights reserved.
