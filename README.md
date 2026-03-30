# DRIP. — AI-Powered Outfit Rating & Style Analysis

  An AI-powered outfit rating and style analysis application built with a modern full-stack architecture. Get instant, editorial-quality fashion feedback powered by OpenAI Vision.

  ## Features

  - **AI Outfit Analysis** — Upload a photo and get a detailed score (0-10) with breakdown across Fit, Color Harmony, Style Coherence, Trend Alignment, Accessorizing, and Occasion Fit
  - **Style DNA** — Personalized style profile built from your scan history
  - **Score Tiers** — Gold (8+), Silver (6-7.9), Bronze (4-5.9), Steel (<4) visual tiers
  - **Scan History** — Track your style evolution over time
  - **Social Sharing** — Generate share cards for your best fits
  - **Demo Mode** — Try the app without uploading real photos

  ## Tech Stack

  ### Backend (Express 5 API)
  - Express 5 with TypeScript
  - PostgreSQL with Drizzle ORM (5 tables: users, scans, scan_items, style_profiles, social_shares)
  - OpenAI Vision API (gpt-5.2 via Replit AI proxy) with 6 pre-built fallback analyses
  - JWT authentication (register/login)
  - Multer + Sharp for image upload and processing

  ### Frontend — React PWA
  - React + Vite + TypeScript
  - Framer Motion animations
  - Radar chart visualization (Recharts)
  - html2canvas share card generation
  - "Editorial Noir" design system

  ### Frontend — Expo Mobile App (iOS/Android)
  - Expo Router with file-based routing
  - NativeTabs with liquid glass (iOS 26+) fallback
  - expo-image-picker for camera/gallery
  - AsyncStorage JWT persistence
  - Custom fonts: Cormorant Garamond + Outfit

  ## Design System — "Editorial Noir"

  - **Background:** Pure black (#000000)
  - **Text:** Warm off-white (#F5F5F0)
  - **Typography:** Cormorant Garamond (display) + Outfit (body)
  - **Corners:** 0px radius (sharp, editorial)
  - **Labels:** All-caps with letter spacing
  - **Score Tiers:** Gold (#C9A84C), Silver (#A8A8A8), Bronze (#CD7F32), Steel (#71797E)

  ## Project Structure

  ```
  ├── artifacts/
  │   ├── api-server/        # Express 5 backend API
  │   ├── drip-app/          # React Vite PWA
  │   └── drip-mobile/       # Expo React Native app
  ├── lib/
  │   └── api-client-react/  # Generated API client (OpenAPI)
  ├── shared/
  │   └── schema/            # Shared Drizzle ORM schema
  └── package.json           # pnpm monorepo root
  ```

  ## Getting Started

  ```bash
  # Install dependencies
  pnpm install

  # Set up environment variables
  # DATABASE_URL=postgresql://...
  # JWT_SECRET=your-secret

  # Run database migrations
  pnpm --filter @workspace/api-server run db:push

  # Start the API server
  pnpm --filter @workspace/api-server run dev

  # Start the web app
  pnpm --filter @workspace/drip-app run dev

  # Start the mobile app
  pnpm --filter @workspace/drip-mobile run dev
  ```

  ## Demo Account

  - **Email:** demo@drip.app
  - **Password:** demo123

  ## License

  MIT
  