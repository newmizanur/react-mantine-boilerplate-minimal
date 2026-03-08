import { NavLink, Stack } from '@mantine/core';
import {
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconSettings
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

const navItems = [
  { to: '/users', label: 'Users', icon: IconBellRinging },
  { to: '/empty', label: 'Empty', icon: IconDatabaseImport },
  { to: '/not-found', label: 'Not Found', icon: IconFingerprint },
  { to: '/login', label: 'Login', icon: IconKey },
  { to: '/register', label: 'Register', icon: IconSettings }
] as const;

type AppSidebarProps = {
  pathname: string;
};

export function AppSidebar({ pathname }: AppSidebarProps) {
  return (
    <Stack gap="xs">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          component={Link}
          to={item.to}
          label={item.label}
          leftSection={<item.icon size={16} stroke={1.5} />}
          active={pathname === item.to}
        />
      ))}
    </Stack>
  );
}
