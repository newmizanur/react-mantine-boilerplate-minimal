import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <Container size={520} py={80}>
      <Stack align="center" gap="md">
        <Title order={1} c="dimmed">
          404
        </Title>
        <Title order={2} ta="center">
          Page not found
        </Title>
        <Text c="dimmed" ta="center">
          The page you are trying to open does not exist.
        </Text>
        <Button component={Link} to="/users">
          Go to Users
        </Button>
      </Stack>
    </Container>
  );
}
