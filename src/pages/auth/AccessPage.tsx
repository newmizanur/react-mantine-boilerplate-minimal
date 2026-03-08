import { Alert, Stack, Title } from '@mantine/core';

export function AccessPage() {
  return (
    <Stack>
      <Title order={2}>Access Denied</Title>
      <Alert color="yellow">You do not have permission to view this page.</Alert>
    </Stack>
  );
}
