import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import { userSchema } from '@/schemas/user.schema';

describe('schemas', () => {
  it('rejects invalid login email', () => {
    const parsed = loginSchema.safeParse({ email: 'bad-email', password: 'secret12' });
    expect(parsed.success).toBe(false);
  });

  it('accepts valid user payload', () => {
    const parsed = userSchema.safeParse({
      name: 'Alex User',
      email: 'alex@example.com',
      role: 'Viewer',
      status: 'Active'
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects register payload when passwords differ', () => {
    const parsed = registerSchema.safeParse({
      name: 'Alex User',
      email: 'alex@example.com',
      password: 'secret12',
      confirmPassword: 'secret13'
    });
    expect(parsed.success).toBe(false);
  });
});
