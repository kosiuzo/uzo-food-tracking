# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development server:** `npm run dev` (runs on port 8080)
**Build:** `npm run build` (production) or `npm run build:dev` (development mode)
**Testing:** `npm test` (watch mode), `npm run test:run` (single run), `npm run test:ui` (Vitest UI)
**E2E testing:** `npm run test:e2e`, `npm run test:e2e:ui` (Playwright)
**Linting:** `npm run lint`

## Architecture Overview

This is a React-based food tracking application with the following key architectural patterns:

### Core Technologies
- **Frontend:** React 18 + TypeScript + Vite
- **UI Framework:** shadcn/ui components with Radix UI primitives
- **Styling:** Tailwind CSS with custom design tokens
- **Database:** Supabase (PostgreSQL) with comprehensive schema
- **State Management:** TanStack React Query for server state, custom hooks for local state
- **Routing:** React Router DOM v6
- **Testing:** Vitest for unit tests, Playwright for E2E tests

### Database Schema
The app uses a sophisticated PostgreSQL schema with the following key tables:
- `items`: Food inventory with nutrition, serving units, and stock tracking
- `recipes`: Recipe definitions with cost calculations and statistics
- `recipe_items`: Junction table linking recipes to ingredients with quantities
- `meal_logs`: Historical meal consumption tracking
- `weekly_meal_plans`, `meal_plan_blocks`, `recipe_rotations`: Complex meal planning system

### Key Features
1. **Food Inventory Management:** Track food items with nutrition, costs, and stock status
2. **Recipe Management:** Create recipes with automatic cost calculation and nutrition aggregation
3. **Meal Planning:** Flexible meal planning with recipe rotations and day-range blocks
4. **Meal Logging:** Track consumed meals with nutrition and cost analytics
5. **AI Recipe Generation:** Integration with Hugging Face for recipe generation

### Project Structure
- `src/components/`: Reusable UI components including dialogs and cards
- `src/components/ui/`: shadcn/ui component library
- `src/pages/`: Main application pages (Index, Recipes, Meals, Analytics, Planner, RecipeGenerator)
- `src/hooks/`: Custom React hooks for data management (useFoodInventory, useMealPlan, etc.)
- `src/lib/`: Utility functions including Supabase client, calculations, and type mappers
- `src/types/`: TypeScript type definitions for database entities and app models
- `supabase/`: Database migrations and schema definitions

### Data Flow Patterns
- Uses TanStack React Query for all server state management
- Custom hooks abstract database operations and provide reactive data
- Type mappers handle conversion between database rows and application models
- Optimistic updates for better UX with automatic rollback on errors

### Key Conventions
- All database interactions go through Supabase client in `src/lib/supabase.ts`
- Type definitions separate database types (`DbItem`, `DbRecipe`) from app types (`FoodItem`, `Recipe`)
- Components use controlled forms with react-hook-form and Zod validation
- Custom hooks follow naming pattern `use[EntityName]` (e.g., `useFoodInventory`)
- Database schema uses RPC functions for complex operations and cost calculations

### Development Notes
- The app uses `@` alias for `src/` directory imports
- Serving units are normalized to volume/weight/package types for consistent calculations
- Recipe costs are automatically calculated when ingredients change
- Meal planning supports flexible day ranges and recipe rotations within blocks