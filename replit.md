# DRIP. — AI-Powered Outfit Rating App

## Overview

DRIP. is an AI-powered outfit rating and style analysis app. Users photograph their outfits and receive AI-generated scores across 5 categories, style archetype classification, upgrade recommendations, celebrity style matches, and a Style DNA profile.

Available as a React PWA and a native mobile app (iOS/Android via Expo).

Built as a pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Web Frontend**: React + Vite PWA, Tailwind CSS, Framer Motion, Recharts, html2canvas
- **Mobile Frontend**: Expo (React Native), expo-router, expo-image-picker
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenAI Vision API via Replit AI Integrations proxy (gpt-5.2)
- **Auth**: JWT (register with username/email/password, login with email/password)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (API), Vite (frontend), Metro (mobile)

## Design System: "Editorial Noir"

- Pure black (#000000) backgrounds
- Warm off-white (#F5F5F0) text
- Display font: Cormorant Garamond (serif) — headings, scores, labels
- Body font: Outfit (sans-serif) — body text
- 0px button border radius (sharp corners)
- 2px card borders, ALL-CAPS labels with letter-spacing: 0.2em
- Score tier colors: Gold (#C9A84C) 8+, Silver (#A8A8A8) 6-7.9, Bronze (#CD7F32) 4-5.9, Steel (#71797E) <4

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express 5 API server (JWT auth, AI analysis, file uploads)
│   ├── drip-app/           # React + Vite PWA frontend
│   └── drip-mobile/        # Expo (React Native) mobile app (iOS/Android)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (seed-drip for demo data)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema (5 tables)

- **users** — id, email, username, passwordHash, isPremium, totalScans, highestScore, avgScore
- **scans** — id, userId, imagePath, overallScore, 5 category scores+details, styleArchetype, vibeTags, occasionMatch, upgrades, colorPalette, celebrityMatch, genderDetected, fullAnalysis
- **similar_outfits** — id, scanId, imageUrl, sourceUrl, title, styleTag
- **style_dna** — id, userId (unique), dominantArchetype, topColors, avgScores, totalOutfitsScanned, bestOutfitId, worstOutfitId, styleEvolution
- **curated_outfits** — id, imageUrl, styleArchetype, gender, season, tags, sourceCredit

## API Endpoints

- `POST /api/auth/register` — {email, username, password} → {token, user}
- `POST /api/auth/login` — {email, password} → {token, user}
- `GET /api/auth/me` — current user profile
- `POST /api/scan` — multipart upload (field: image), x-demo-mode header
- `GET /api/scan/history` — paginated scan history with stats
- `GET /api/scan/:id` — full scan result
- `GET /api/similar/:scanId` — similar outfit suggestions
- `GET /api/recommendations/:scanId` — upgrade recommendations
- `GET /api/style-dna` — Style DNA profile (locked until 5 scans)
- `GET /api/style-dna/report` — monthly style report
- `GET /api/leaderboard` — global leaderboard
- `GET /api/stats` — global app stats

## Frontend Pages (9)

1. **Landing** (`/landing`) — Splash screen with DRIP. branding, CTA buttons
2. **Login** (`/login`) — Email + password login
3. **Register** (`/register`) — Username + email + password registration
4. **Dashboard** (`/`) — Stats, recent scans, "Analyze New Fit" CTA
5. **Scan** (`/scan`) — Camera/file upload with demo mode toggle
6. **Result** (`/result/:id`) — Score reveal with radar chart, category breakdown, upgrades, celebrity match
7. **History** (`/history`) — Paginated grid of past scans
8. **Style DNA** (`/dna`) — Profile unlocked after 5 scans
9. **Profile** (`/profile`) — User info, logout

## Mobile App Screens (Expo)

- **Landing** (`/`) — Splash with DRIP. branding, GET STARTED / SIGN IN buttons
- **Login** (`/login`) — Email + password login with demo credentials shortcut
- **Register** (`/register`) — Username + email + password registration
- **Dashboard** (`/(tabs)/`) — Stats cards (scans, avg score, best), recent scan list
- **Scan** (`/(tabs)/scan`) — Camera/gallery image picker, demo mode toggle, outfit upload
- **History** (`/(tabs)/history`) — FlatList of past scans with pull-to-refresh
- **Profile** (`/(tabs)/profile`) — User info, avg score circle, Style DNA preview, sign out
- **Results** (`/results/[id]`) — Full scan results: score circle, breakdown bars, archetype, vibe tags, celebrity match, color palette, upgrades, occasion match
- **Style DNA** (`/style-dna`) — Locked state with progress bar, or full analysis with archetype, top colors, score trend, style evolution timeline

## Key Features

- AI outfit analysis via OpenAI Vision with 6 pre-built fallback analyses
- Free tier: 3 scans/day, premium bypasses limit
- Demo mode via `x-demo-mode: true` header
- Share card feature (html2canvas screenshot)
- Bottom tab navigation with elevated gold Scan button
- Framer Motion page transitions and score counter animation
- Mobile-first responsive design (max-w-md container)

## Demo Account

- Email: demo@drip.app
- Password: demo123
- Has 8 pre-seeded scans and premium status

## Scripts

- `pnpm --filter @workspace/scripts run seed-drip` — Seed demo data
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API hooks
- `pnpm --filter @workspace/db run push` — Push schema to DB
