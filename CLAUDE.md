# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development server:** `npm run dev` (development mode, port 8080) or `npm run dev:prod` (production config, port 8080)
**Build:** `npm run build` (production mode) or `npm run build:dev` (development mode)
**Preview:** `npm run preview` (default), `npm run preview:dev` (development mode), or `npm run preview:prod` (production mode)
**Testing:** `npm test` (watch mode), `npm run test:run` (single run), `npm run test:ui` (Vitest UI)
**E2E testing:** `npm run test:e2e`, `npm run test:e2e:ui` (Playwright)
**Linting:** `npm run lint`

## Pre-Commit Checklist

Before committing any changes, run these commands to ensure code quality and prevent breaking changes:

```bash
# 1. TypeScript type checking
npx tsc --noEmit

# 2. ESLint
npm run lint

# 3. Run all tests
npm run test:run

# 4. Build project
npm run build
```

**All four commands must pass without errors before committing.** These are the same checks that run in CI/CD, so running them locally prevents failed builds and broken deployments.

### Quick Pre-Commit Command
You can run all checks in sequence with:
```bash
npx tsc --noEmit && npm run lint && npm run test:run && npm run build
```

If any step fails, fix the issues before committing. Common issues:
- **TypeScript errors:** Fix type mismatches and undefined property access
- **Lint warnings:** Address code style and potential issues
- **Test failures:** Update tests to match code changes or fix broken functionality
- **Build errors:** Resolve import/export issues and missing dependencies

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

### Mobile-First Development Guidelines

**All components and pages must be designed with mobile-first principles:**

1. **Responsive Design:**
   - Use Tailwind's mobile-first breakpoint system (`sm:`, `md:`, `lg:`, `xl:`)
   - Start with mobile layouts and enhance for larger screens
   - Ensure touch-friendly interactions (minimum 44px touch targets)

2. **Component Responsiveness:**
   - Dialogs and modals should be full-screen on mobile devices
   - Cards and lists should stack vertically on small screens
   - Navigation should be accessible via hamburger menu on mobile
   - Forms should use appropriate input types for mobile (date pickers, number inputs)

3. **Layout Considerations:**
   - Use flexbox and grid layouts that adapt to screen size
   - Implement proper spacing that scales with viewport
   - Ensure content doesn't overflow horizontally on mobile
   - Use appropriate font sizes for mobile readability

4. **Mobile-Specific Features:**
   - Leverage the existing `use-mobile.tsx` hook for responsive logic
   - Implement swipe gestures where appropriate
   - Ensure keyboard navigation works on mobile devices
   - Test on various mobile screen sizes and orientations

### Key Conventions
- All database interactions go through Supabase client in `src/lib/supabase.ts`
- Type definitions separate database types (`DbItem`, `DbRecipe`) from app types (`FoodItem`, `Recipe`)
- Components use controlled forms with react-hook-form and Zod validation
- Custom hooks follow naming pattern `use[EntityName]` (e.g., `useFoodInventory`)
- Database schema uses RPC functions for complex operations and cost calculations
- **Mobile-first design: All new components and pages must be mobile-responsive by default**
- **Touch-friendly: Ensure all interactive elements meet mobile accessibility standards**

### Development Notes
- The app uses `@` alias for `src/` directory imports
- Serving units are normalized to volume/weight/package types for consistent calculations
- Recipe costs are automatically calculated when ingredients change
- Meal planning supports flexible day ranges and recipe rotations within blocks
- **Always test responsive behavior across different screen sizes during development**
- **Use the existing mobile utilities and hooks for consistent mobile behavior**

### Common Issues and Debugging
- **MultiSelect Components:** Always ensure database numeric IDs are converted to strings for UI components to prevent "black blobs" or pre-selection failures
- **Type Consistency:** Database types (numbers) must be consistently converted to UI component expected types (strings) at component boundaries
- **Form Edit Mode:** Test both add and edit modes when implementing forms with MultiSelect or complex components
- **Troubleshooting Reference:** See `docs/troubleshooting-guide.md` for detailed solutions to common issues

### Documentation Maintenance
- **Update `docs/troubleshooting-guide.md` when:**
  - The same issue occurs multiple times across different features
  - A bug requires more than 30 minutes to debug and has a non-obvious solution
  - Issues involve component integration, data flow, or type mismatches
  - Solutions require understanding of multiple files or architectural patterns
- **Update this CLAUDE.md when:**
  - New architectural patterns are established
  - New development conventions are adopted
  - New tools or libraries are added to the project
  - Breaking changes affect multiple components or workflows