import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  role: z.enum(['Admin', 'Manager', 'Viewer']),
  status: z.enum(['Active', 'Invited', 'Disabled'])
});

export type UserInputSchema = z.infer<typeof userSchema>;

export const userResponseSchema = userSchema.extend({
  id: z.union([z.string(), z.number()]),
  created_at: z.string(),
  updated_at: z.string()
});
