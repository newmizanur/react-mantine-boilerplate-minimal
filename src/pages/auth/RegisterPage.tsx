import { Anchor, Button, Card, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { zodResolver } from '@mantine/form';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { registerSchema, type RegisterInput } from '@/schemas/auth.schema';
import { useAuthStore } from '@/stores';

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegisterInput>({
    mode: 'controlled',
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: zodResolver(registerSchema)
  });

  async function onSubmit(values: RegisterInput) {
    try {
      setSubmitting(true);
      await register(values.email, values.password, values.name);
      notifications.show({ color: 'green', message: 'Account created successfully' });
      navigate({ to: '/users' });
    } catch {
      notifications.show({ color: 'red', message: 'Unable to register' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card maw={460} mx="auto" mt={80} withBorder>
      <Stack>
        <Title order={2}>Create Account</Title>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput label="Name" placeholder="Your name" {...form.getInputProps('name')} />
            <TextInput label="Email" placeholder="name@company.com" {...form.getInputProps('email')} />
            <PasswordInput label="Password" placeholder="Create password" {...form.getInputProps('password')} />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm password"
              {...form.getInputProps('confirmPassword')}
            />
            <Button type="submit" loading={submitting}>
              Register
            </Button>
          </Stack>
        </form>
        <Anchor href="/login">Already have an account?</Anchor>
      </Stack>
    </Card>
  );
}
