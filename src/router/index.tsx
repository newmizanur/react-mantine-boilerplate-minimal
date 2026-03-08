import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect
} from '@tanstack/react-router';
import { AppLayout } from '@/layouts/AppLayout';
import { useAuthStore } from '@/stores';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: () => {
    const authenticated = useAuthStore.getState().authenticated;
    if (!authenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppLayout
});

const usersRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/users',
  component: lazyRouteComponent(() => import('@/pages/UsersPage').then((m) => ({ default: m.UsersPage })))
});

const emptyRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/empty',
  component: lazyRouteComponent(() => import('@/pages/EmptyPage').then((m) => ({ default: m.EmptyPage })))
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/users' });
  }
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazyRouteComponent(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
});

const accessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access',
  component: lazyRouteComponent(() => import('@/pages/auth/AccessPage').then((m) => ({ default: m.AccessPage })))
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: lazyRouteComponent(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
});

const errorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/error',
  component: lazyRouteComponent(() => import('@/pages/auth/ErrorPage').then((m) => ({ default: m.ErrorPage })))
});

const notFoundRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/not-found',
  component: lazyRouteComponent(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
});

const routeTree = rootRoute.addChildren([
  protectedLayoutRoute.addChildren([usersRoute, emptyRoute, notFoundRoute]),
  homeRoute,
  loginRoute,
  registerRoute,
  accessRoute,
  errorRoute
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent'
});

export function AppRouter() {
  return <RouterProvider router={router} />;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
