# Aqar

A bilingual real-estate web app for browsing, buying, and renting homes. Built with React, Clean Architecture, and Domain-Driven Design.

Pairs with the **[aqar-backend](../aqar-backend)** Laravel API (`/api/v1`).

## Features

- **Home** — panorama hero, property search filters, and featured homes
- **Buy / Rent** — listing grid with sorting, filters, and Google Maps
- **Property detail** — gallery, amenities, tour player, nearby map, and related homes
- **Saved** — favorites for signed-in users
- **Manage** — owner property CRUD (`accountType=owner`)
- **About** — brand story, values, and CTA
- **Contact** — contact info and message form
- **Auth** — password + Google OAuth (JWT from Laravel)
- **i18n** — English and Arabic (`en` / `ar`)

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, Tailwind CSS, shadcn/ui |
| Routing | React Router |
| Server state | TanStack Query |
| Client state | Zustand |
| Forms | React Hook Form |
| Maps | Google Maps (`@vis.gl/react-google-maps`) |
| Auth | JWT Bearer (`VITE_API_BASE_URL`) + Google Identity |
| i18n | i18next / react-i18next |
| Build | Vite 8, TypeScript |
| Deploy | Vercel (SPA rewrites) |
| Backend | Laravel API (`aqar-backend`) |

## Architecture

```
src/
├── app/               # Router, layouts, providers
├── domain/            # Entities, types, pure domain logic
├── infrastructure/    # API repositories (Laravel `/api/v1`)
├── presentation/      # Pages, components, hooks, stores
├── shared/            # i18n, utilities
└── components/ui/     # Shared UI primitives (shadcn)
```

## Getting started

### Prerequisites

- Node.js **20+**
- Running **aqar-backend** (`php artisan serve` → `http://localhost:8000`)

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
VITE_GOOGLE_CLIENT_ID=your_oauth_web_client_id
```

- Enable **Maps JavaScript API** for the Maps key.
- Add `http://localhost:5173` as an Authorized JavaScript origin for the OAuth client.
- Use the same Client ID in `aqar-backend` `GOOGLE_CLIENT_ID`.

### Run

```bash
# Terminal 1 — Laravel API
cd ../aqar-backend
php artisan migrate:fresh --seed
php artisan serve

# Terminal 2 — React app
npm run dev
```

Demo login (seeded): username `demo` / password `Demo123!`

### Other scripts

```bash
npm run build    # Typecheck + production build
npm run preview  # Preview the production build
npm run lint     # ESLint
npm run test     # Vitest
```

## API wiring

Repositories under `src/infrastructure/` call Laravel:

| Repository | Endpoints |
|------------|-----------|
| Auth | `/auth/login`, `/register`, `/google/*`, `/me`, `/logout` |
| Listings | `GET /listings`, `GET /listings/{id}` |
| Search | `GET /search/filters`, `GET /search/locations` |
| Carousel | `GET /carousel/slides` |
| Contact | `GET /contact/info`, `POST /contact/messages` |
| Saved | `/me/saved-listings/*` (Bearer) |
| Owner | `/owner/properties` (Bearer, owner account) |

Authenticated requests send `Authorization: Bearer <accessToken>` from the Zustand session.

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/buy` | Buy listings |
| `/rent` | Rent listings |
| `/homes/:propertyId` | Property detail |
| `/saved` | Saved houses |
| `/manage` | Owner property management |
| `/about` | About |
| `/contact` | Contact |

Auth uses modals in the header (not dedicated routes).

## Path alias

```ts
import { HomePage } from '@/presentation/pages/HomePage'
```

## License

Private project — all rights reserved.
