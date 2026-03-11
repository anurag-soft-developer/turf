import { z } from 'zod';

// Match the backend validation rules exactly
export const registerSchema = z.object({
  email: z
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(50, 'Password must not exceed 50 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(100, 'Full name must not exceed 100 characters'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]{10,15}$/, 'Please provide a valid phone number')
    .optional().or(z.literal('')), // Allow empty string for optional phone
  bio: z
    .string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional().or(z.literal('')), // Allow empty string for optional bio
});

export const loginSchema = z.object({
  email: z
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(1, 'Password cannot be empty'),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .max(50, 'New password must not exceed 50 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(50, 'Password must not exceed 50 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(100, 'Full name must not exceed 100 characters')
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]{10,15}$/, 'Please provide a valid phone number')
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional(),
});

// Types from schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;