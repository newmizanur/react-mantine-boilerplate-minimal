import { Alert, Stack, Title } from '@mantine/core';

export function ErrorPage() {
  return (
    <Stack>
      <Title order={2}>Application Error</Title>
      <Alert color="red">Something went wrong. Try again later.</Alert>
    </Stack>
  );
}
