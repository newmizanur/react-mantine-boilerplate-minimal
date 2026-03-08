import { Divider, Text } from '@mantine/core';

export function AppFooter() {
  return (
    <>
      <Divider my="md" />
      <Text ta="center" c="dimmed" size="sm" pb="xs">
        © {new Date().getFullYear()} Mantine Boilerplate
      </Text>
    </>
  );
}
