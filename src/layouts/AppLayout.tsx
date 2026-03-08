import { AppShell, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { AppFooter } from '@/layouts/components/AppFooter';
import { AppSidebar } from '@/layouts/components/AppSidebar';
import { AppTopbar } from '@/layouts/components/AppTopbar';

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = useRouterState({
    select: (state) => state.location.pathname
  });

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <AppTopbar onToggleMenu={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <AppSidebar pathname={pathname} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box mih="calc(100dvh - 56px - 2rem)" style={{ display: 'flex', flexDirection: 'column' }}>
          <Box style={{ flex: 1 }}>
            <Outlet />
          </Box>
          <AppFooter />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
