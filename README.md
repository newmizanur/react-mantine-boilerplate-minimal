# Mantine Boilerplate (React + TS)

A minimal, production-ready boilerplate using React, Mantine, Zod, Zustand, and TanStack Router.

## Tech stack
- React 18 + TypeScript + Vite
- Mantine (`@mantine/core`, `@mantine/form`, `@mantine/hooks`, `@mantine/modals`, `@mantine/notifications`)
- TanStack Router (code-based routes)
- Zustand (app stores)
- Zod (validation)
- Axios (HTTP client)
- `json-server` mock API
- Vitest (tests)

## Current app features
- Protected app layout (`/users`, `/empty`, `/not-found`)
- Auth pages (`/login`, `/register`, `/access`, `/error`)
- Sidebar + topbar + footer split into reusable layout components
- Users CRUD with:
  - server-side pagination
  - sorting
  - search + search field filter
  - row selection and bulk delete
  - CSV export
- Form validation using Mantine form + Zod

## Routes
- `/` -> redirects to `/users`
- `/users` (protected)
- `/empty` (protected)
- `/not-found` (protected)
- `/login`
- `/register`
- `/access`
- `/error`

## Project structure
```text
src/
  layouts/
    components/
      AppTopbar.tsx
      AppSidebar.tsx
      AppFooter.tsx
    AppLayout.tsx
  pages/
    auth/
      LoginPage.tsx
      RegisterPage.tsx
      AccessPage.tsx
      ErrorPage.tsx
    UsersPage.tsx
    EmptyPage.tsx
    NotFoundPage.tsx
  providers/
    AppProviders.tsx
  router/
    index.tsx
  schemas/
  services/
  stores/
  tests/
mock/
  db.json
```

## Getting started
1. Install dependencies
```bash
npm install
```

2. Start mock API
```bash
npm run mock:api
```

3. Start app (new terminal)
```bash
npm run dev
```

## Scripts
- `npm run dev` - start Vite dev server
- `npm run mock:api` - start json-server on `http://localhost:3001`
- `npm run test` - run Vitest
- `npm run typecheck` - run TypeScript checks
- `npm run lint` - run ESLint
- `npm run build` - production build

## How to add a new page
Example: add `/reports`.

1. Create the page component
- File: `src/pages/ReportsPage.tsx`

2. Register route in `src/router/index.tsx`
- Import `ReportsPage`
- Create route:
```ts
const reportsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/reports',
  component: ReportsPage
});
```
- Add it to route tree children:
```ts
protectedLayoutRoute.addChildren([usersRoute, emptyRoute, notFoundRoute, reportsRoute])
```

3. Add sidebar item in `src/layouts/components/AppSidebar.tsx`
- Add a nav item with `to: '/reports'` and an icon.

4. (Optional) Add store/service/schema
- `src/stores/reports.store.ts`
- `src/services/reports.service.ts`
- `src/schemas/reports.schema.ts`

5. Add tests
- Create relevant tests in `src/tests/`.

### Protected vs public routes
Use this rule:
- Protected route: child of `protectedLayoutRoute` (requires auth)
- Public route: child of `rootRoute` (no auth required)

Protected example (`/reports`):
```ts
const reportsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/reports',
  component: ReportsPage
});
```

Public example (`/forgot-password`):
```ts
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage
});
```

## Real auth implementation plan (future)
Current auth is mock-based and local-state driven. To move to real auth:

1. Replace mock auth service
- Update `src/services/auth.service.ts` to call real endpoints:
  - `POST /auth/login`
  - `POST /auth/register`
  - `POST /auth/refresh`
  - `GET /auth/me`

2. Extend auth store
- `accessToken`, `refreshToken`, `expiresAt`, `user`
- Add `hydrateAuth()`, `refreshSession()`, `logout()`
- Persist only what is needed.

3. Add interceptor flow in `src/services/http.ts`
- Attach access token on requests
- On `401`, try single token refresh and retry request
- If refresh fails, clear auth and redirect to `/login`

4. Guard routes
- Keep protected routes blocked when unauthenticated
- Redirect authenticated users away from `/login` and `/register` to `/users`

5. Wire topbar logout
- Replace placeholder user icon action with `useAuthStore().logout()`.

6. Add auth tests
- Route guard tests
- Refresh flow tests
- Logout behavior tests

## Notes
- `json-server` v1 uses `_page` + `_per_page` pagination behavior.
- If data changes are not reflected, restart mock API.
