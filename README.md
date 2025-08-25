# Uzo Food Tracking

A mobile-first PWA for tracking food inventory, planning meals, and logging consumption. The app uses Supabase for data storage and includes AI-assisted recipe generation.

## Features
- Maintain a pantry inventory with nutrition facts, prices, and stock status
- Autofill item details from Open Food Facts or receipt OCR
- Create recipes with automatic cost and macro calculations
- Plan weekly meals and log what you cook
- Generate new meal ideas using Hugging Face models

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **UI:** shadcn/ui (Radix UI) + Tailwind CSS
- **State:** TanStack React Query
- **Backend:** Supabase (PostgreSQL)
- **Testing:** Vitest, Playwright

## Getting Started
1. Install dependencies
   ```sh
   npm install
   ```
2. Provide Supabase credentials in a `.env` file:
   ```env
   VITE_SUPABASE_URL=your-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Start the development server
   ```sh
   npm run dev
   ```
   The app runs at [http://localhost:8080](http://localhost:8080).

## Testing
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`
- Lint: `npm run lint`

## Project Structure
```
├─ src/              # React source (components, pages, hooks, lib, types)
├─ supabase/         # SQL migrations and seed data
├─ public/           # Static assets
└─ product-requirements/  # Design and architecture docs
```

## Deployment
Build a production bundle:
```sh
npm run build
```
