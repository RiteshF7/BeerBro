import { z } from 'zod';
import { USER_ROLES } from '@/lib/constants';

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  displayName: z.string().optional(),
  role: z.enum(USER_ROLES),
  isActive: z.boolean(),
});

export type UserFormData = z.infer<typeof userSchema>;

export interface UserWithId extends UserFormData {
  id: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}
