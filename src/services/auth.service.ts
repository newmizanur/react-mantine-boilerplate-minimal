import type { LoginInput } from '@/schemas/auth.schema';

type AuthResponse = {
  token: string;
  name: string;
};

export async function loginService(input: LoginInput): Promise<AuthResponse> {
  const safeName = input.email.split('@')[0] ?? 'user';
  return {
    token: `token_${Date.now()}`,
    name: safeName
  };
}

export async function registerService(input: LoginInput & { name: string }): Promise<AuthResponse> {
  return {
    token: `token_${Date.now()}`,
    name: input.name
  };
}
