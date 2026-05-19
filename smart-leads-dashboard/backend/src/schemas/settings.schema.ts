import { z } from 'zod';

/**
 * Zod validation schema for PUT /api/auth/profile
 */
export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .trim()
        .optional(),
      email: z
        .string()
        .email('Please provide a valid email address')
        .toLowerCase()
        .trim()
        .optional(),
    })
    .refine((data) => data.name !== undefined || data.email !== undefined, {
      message: 'At least one of name or email must be provided',
    }),
});

/**
 * Zod validation schema for PUT /api/auth/password
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password cannot exceed 128 characters'),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
