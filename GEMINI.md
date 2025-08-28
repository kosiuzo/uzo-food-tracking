# Gemini Code Assistant Context

This document provides context for the Gemini code assistant to understand the Uzo Food Tracking project.

## Project Overview

Uzo Food Tracking is a mobile-first Progressive Web App (PWA) for tracking food inventory, planning meals, and logging consumption. The application is built with a modern tech stack, including:

*   **Frontend:** React 18, TypeScript, and Vite.
*   **UI:** A combination of `shadcn/ui` (which is built on Radix UI) and Tailwind CSS for a utility-first styling approach.
*   **State Management:** TanStack React Query for managing server state and caching data from the backend.
*   **Backend:** Supabase, a backend-as-a-service platform that provides a PostgreSQL database, authentication, and auto-generated APIs.
*   **AI Features:** The application includes AI-assisted recipe generation, likely using a third-party service like Hugging Face.

The application is designed to be resilient, with a fallback to mock data when a connection to the Supabase backend is unavailable. This allows for development and demonstration of the application without requiring a live database connection.

## Building and Running

The following commands are used to build, run, and test the application:

*   **Install Dependencies:**
    ```sh
    npm install
    ```
*   **Run Development Server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.
*   **Build for Production:**
    ```sh
    npm run build
    ```
*   **Run Unit Tests:**
    ```sh
    npm test
    ```
*   **Run End-to-End (E2E) Tests:**
    ```sh
    npm run test:e2e
    ```
*   **Lint the Code:**
    ```sh
    npm run lint
    ```

## Development Conventions

*   **Styling:** The project uses `shadcn/ui` for its component library and Tailwind CSS for styling. This means that new components should be built using these tools to maintain a consistent look and feel.
*   **State Management:** Server state, such as the food inventory and meal plans, is managed with TanStack React Query. When fetching or updating data from Supabase, use the hooks and patterns provided by React Query to handle caching, optimistic updates, and error handling.
*   **Routing:** The application uses `react-router-dom` for client-side routing. New pages should be added to the `src/pages` directory and integrated into the routing structure in `src/App.tsx`.
*   **Testing:** The project has a comprehensive testing setup with Vitest for unit tests and Playwright for E2E tests. New features should be accompanied by corresponding tests to ensure that they are working correctly and do not introduce regressions.
*   **Database:** The database schema is managed with Supabase migrations, which are located in the `supabase/migrations` directory. Any changes to the database schema should be made through a new migration file.
*   **Fallback to Mock Data:** The application is designed to fall back to mock data when a Supabase connection is not available. This is handled in the data fetching hooks, such as `useFoodInventory.deprecated.ts`. This is a key feature to be aware of when working on data-related functionality.
*   **Code Structure:** The project follows a standard React project structure, with a clear separation of concerns between components, hooks, pages, and library functions. New code should be organized in a similar manner to maintain a clean and maintainable codebase.
