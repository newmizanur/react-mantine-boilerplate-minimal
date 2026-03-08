import { ActionIcon, Group, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { IconMenu2, IconMoon, IconSun, IconUser } from '@tabler/icons-react';

type AppTopbarProps = {
  onToggleMenu: () => void;
};

export function AppTopbar({ onToggleMenu }: AppTopbarProps) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <ActionIcon variant="subtle" size="lg" onClick={onToggleMenu} aria-label="Toggle menu">
          <IconMenu2 size={18} />
        </ActionIcon>
        <Text fw={700}>Mantine Boilerplate</Text>
      </Group>

      <Group gap="xs">
        <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}>
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle color scheme"
          >
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Logout (coming soon)">
          <ActionIcon variant="subtle" size="lg" aria-label="User menu">
            <IconUser size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
