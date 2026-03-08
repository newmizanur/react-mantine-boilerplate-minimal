import { Card, Stack, Text, Title } from '@mantine/core';

export function EmptyPage() {
  return (
    <Card withBorder>
      <Stack>
        <Title order={2}>Empty Page</Title>
        <Text c="dimmed">Use this page for future feature scaffolding.</Text>
      </Stack>
    </Card>
  );
}
