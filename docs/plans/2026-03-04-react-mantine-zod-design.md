# React Mantine Zod Boilerplate Design

**Date:** March 4, 2026

## Objective
Create a React boilerplate in `/home/dev/workspace/playground/mantine-boilerplate` using Mantine, Zod, Zustand, TanStack Router, and TanStack Query, modeled after `sakai-vue-minimal` with special emphasis on `src/stores` and `src/pages`.

## Reference Mapping from Sakai Vue Minimal
- `src/views/pages/*` -> `src/pages/*`
- `src/stores/auth.js` -> `src/stores/auth.store.ts`
- `src/stores/users.js` -> `src/stores/users.store.ts`
- `src/router/index.js` -> `src/router/index.tsx`

## Architecture
- Routing: TanStack Router with route paths compatible with Sakai naming (`/pages/users`, `/auth/login`, etc).
- UI: Mantine components and layout shell.
- Form Validation: Mantine form + Zod resolver.
- Client State: Zustand stores for auth and users table filters.
- Server State: TanStack Query for async data fetching/mutations.
- API Layer: Service modules under `src/services` with a typed in-memory fallback implementation.

## Store Design
- `auth.store.ts`
- State: `token`, `name`, `ready`
- Actions: `login`, `register`, `logout`
- Derived: `authenticated`
- Persistence: localStorage via Zustand persist middleware

- `users.store.ts`
- State: `users`, `total`, `page_size`, `current_page`, `search`, `searchField`, `sortField`, `sortOrder`
- Actions: setters + `applyFetchedUsers`

## Pages Design
- `src/pages/UsersPage.tsx`: users table, search, pagination, create user modal with validation.
- `src/pages/EmptyPage.tsx`: placeholder utility page.
- `src/pages/NotFoundPage.tsx`: route miss/fallback.
- `src/pages/auth/LoginPage.tsx`: login form with Zod.
- `src/pages/auth/AccessPage.tsx`, `ErrorPage.tsx`: auth status pages.

## Error Handling
- Schema validation catches and displays input errors.
- Query mutation errors surfaced via Mantine notifications.
- Router fallback handles unknown routes.

## Testing Strategy
- Schema tests for auth and user validation.
- Store tests for auth and users store behavior.
- Keep tests focused on behavior and state transitions.

## Tradeoff Notes
- In-memory API layer keeps boilerplate runnable without backend.
- Route-first code generation of TanStack is skipped to keep setup explicit and easy to customize.
