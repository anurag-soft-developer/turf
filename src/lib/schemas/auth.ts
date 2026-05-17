import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const phoneRegex = /^\+?[\d\s\-()]{10,15}$/;
const otpRegex = /^\d{6}$/;

export const registerSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must not exceed 50 characters")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must not exceed 100 characters"),
  phone: z
    .string()
    .regex(phoneRegex, "Please provide a valid phone number")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z.string().min(1, "Password cannot be empty"),
});

export const verifyLoginOtpSchema = z.object({
  email: z.email("Please provide a valid email address"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(otpRegex, "OTP must be 6 digits"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(otpRegex, "OTP must be 6 digits")
      .optional(),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .max(50, "New password must not exceed 50 characters")
      .regex(
        passwordRegex,
        "New password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Please provide a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    email: z.email("Please provide a valid email address"),
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(otpRegex, "OTP must be 6 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must not exceed 50 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  email: z.email("Please provide a valid email address"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(otpRegex, "OTP must be 6 digits"),
});

export const sendVerificationEmailSchema = z.object({
  email: z.email("Please provide a valid email address"),
});

export const updateTwoFactorSchema = z.object({
  enabled: z.boolean(),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(otpRegex, "OTP must be 6 digits"),
});

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must not exceed 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(phoneRegex, "Please provide a valid phone number")
    .or(z.literal(""))
    .optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  avatar: z.string().optional(),
});

export const updateNotificationSettingsSchema = z.object({
  emailNotificationsEnabled: z.boolean().optional(),
  smsNotificationsEnabled: z.boolean().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyLoginOtpFormData = z.infer<typeof verifyLoginOtpSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type SendVerificationEmailFormData = z.infer<
  typeof sendVerificationEmailSchema
>;
export type UpdateTwoFactorFormData = z.infer<typeof updateTwoFactorSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type UpdateNotificationSettingsFormData = z.infer<
  typeof updateNotificationSettingsSchema
>;

/** Payload sent to POST /auth/change-password. */
export type ChangePasswordPayload = ChangePasswordFormData;

/** Payload sent to POST /auth/reset-password (excludes confirmPassword). */
export type ResetPasswordPayload = Pick<
  ResetPasswordFormData,
  "email" | "otp" | "password"
>;
