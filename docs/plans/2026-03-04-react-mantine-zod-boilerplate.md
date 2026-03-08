# React Mantine Zod Boilerplate Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready React + Mantine + Zod boilerplate that mirrors Sakai Vue Minimal store/page structure.

**Architecture:** Use TanStack Router for route structure, Zustand for app stores, and TanStack Query for server interactions with an in-memory service layer. Validation uses Zod with Mantine form resolvers. Keep file layout explicit and opinionated for onboarding.

**Tech Stack:** React 18, TypeScript, Vite, Mantine, Zod, Zustand, TanStack Router, TanStack Query, Axios, Vitest

---

### Task 1: Project and Tooling Skeleton

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- Create: `src/main.tsx`, `src/styles.css`

**Step 1: Write the failing test**
- Add schema/store test placeholders importing unresolved modules.

**Step 2: Run test to verify it fails**
- Run: `npm test`
- Expected: FAIL with missing modules.

**Step 3: Write minimal implementation**
- Add project config and base entry files.

**Step 4: Run test to verify it passes**
- Run: `npm test`
- Expected: test runner starts and resolves base modules.

**Step 5: Commit**
- `git add . && git commit -m "chore: scaffold react mantine boilerplate"`

### Task 2: Routing, Layout, and Pages

**Files:**
- Create: `src/router/index.tsx`
- Create: `src/layouts/AppLayout.tsx`
- Create: `src/pages/UsersPage.tsx`, `src/pages/EmptyPage.tsx`, `src/pages/NotFoundPage.tsx`
- Create: `src/pages/auth/LoginPage.tsx`, `src/pages/auth/AccessPage.tsx`, `src/pages/auth/ErrorPage.tsx`

**Step 1: Write the failing test**
- Test route resolution for known and unknown routes.

**Step 2: Run test to verify it fails**
- Run: `npm test src/tests/router.test.ts`
- Expected: FAIL because router/pages don’t exist.

**Step 3: Write minimal implementation**
- Define explicit routes with TanStack Router.

**Step 4: Run test to verify it passes**
- Run: `npm test src/tests/router.test.ts`
- Expected: PASS.

**Step 5: Commit**
- `git add . && git commit -m "feat: add app routes and page scaffolds"`

### Task 3: Stores and Validation

**Files:**
- Create: `src/stores/auth.store.ts`, `src/stores/users.store.ts`, `src/stores/index.ts`, `src/stores/_templateStore.ts`
- Create: `src/schemas/auth.schema.ts`, `src/schemas/user.schema.ts`
- Create: `src/tests/auth.store.test.ts`, `src/tests/users.store.test.ts`, `src/tests/schemas.test.ts`

**Step 1: Write the failing test**
- Add store/schema behavior tests.

**Step 2: Run test to verify it fails**
- Run: `npm test src/tests/*.test.ts`
- Expected: FAIL for unimplemented actions and schemas.

**Step 3: Write minimal implementation**
- Implement Zustand stores and Zod schemas.

**Step 4: Run test to verify it passes**
- Run: `npm test src/tests/*.test.ts`
- Expected: PASS.

**Step 5: Commit**
- `git add . && git commit -m "feat: add stores and zod schemas"`

### Task 4: Services, Query Hooks, and Forms

**Files:**
- Create: `src/services/http.ts`, `src/services/auth.service.ts`, `src/services/users.service.ts`
- Create: `src/providers/AppProviders.tsx`
- Update: `src/pages/UsersPage.tsx`, `src/pages/auth/LoginPage.tsx`

**Step 1: Write the failing test**
- Add tests for service/store integration points.

**Step 2: Run test to verify it fails**
- Run: `npm test`
- Expected: FAIL for missing service behavior.

**Step 3: Write minimal implementation**
- Add in-memory service + query/mutation integration and validated forms.

**Step 4: Run test to verify it passes**
- Run: `npm test`
- Expected: PASS.

**Step 5: Commit**
- `git add . && git commit -m "feat: add query services and validated forms"`

### Task 5: Verification and Cleanup

**Files:**
- Update: `README.md` (usage and structure)

**Step 1: Write the failing test**
- N/A (verification task)

**Step 2: Run checks**
- Run: `npm run test && npm run build`

**Step 3: Fix minimal issues**
- Resolve any compile/test issues.

**Step 4: Re-run checks**
- Run: `npm run test && npm run build`
- Expected: PASS.

**Step 5: Commit**
- `git add . && git commit -m "docs: add boilerplate usage and structure"`
