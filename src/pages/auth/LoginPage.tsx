import { Anchor, Button, Card, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { zodResolver } from '@mantine/form';
import { useForm } from '@mantine/form';
import { useNavigate } from '@tanstack/react-router';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { loginSchema, type LoginInput } from '@/schemas/auth.schema';
import { useAuthStore } from '@/stores';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginInput>({
    mode: 'controlled',
    initialValues: {
      email: '',
      password: ''
    },
    validate: zodResolver(loginSchema)
  });

  async function onSubmit(values: LoginInput) {
    try {
      setSubmitting(true);
      await login(values.email, values.password);
      notifications.show({ color: 'green', message: 'Logged in successfully' });
      navigate({ to: '/users' });
    } catch {
      notifications.show({ color: 'red', message: 'Unable to login' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card maw={420} mx="auto" mt={80} withBorder>
      <Stack>
        <Title order={2}>Sign in</Title>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput label="Email" placeholder="name@company.com" {...form.getInputProps('email')} />
            <PasswordInput label="Password" placeholder="Your password" {...form.getInputProps('password')} />
            <Button type="submit" loading={submitting}>
              Login
            </Button>
          </Stack>
        </form>
        <Anchor href="/access">Need access?</Anchor>
      </Stack>
    </Card>
  );
}
