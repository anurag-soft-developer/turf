import { z } from "zod";
import {
  resolveAuthIdentifier,
  validateAuthIdentifier,
} from "@/lib/utils/phone.util";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const otpRegex = /^\d{6}$/;

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(50, "Password must not exceed 50 characters")
  .regex(
    passwordRegex,
    "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
  );

const otpField = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(otpRegex, "OTP must be 6 digits");

const identifierField = z
  .string()
  .min(1, "Email or phone is required")
  .superRefine((val, ctx) => {
    const error = validateAuthIdentifier(val);
    if (error) {
      ctx.addIssue({ code: "custom", message: error });
    }
  });

export const registerSchema = z.object({
  identifier: identifierField,
  password: passwordField,
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must not exceed 100 characters"),
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  identifier: identifierField,
  password: z.string().min(1, "Password cannot be empty"),
});

/** OTP-only form; contact comes from the login challenge. */
export const verifyLoginOtpSchema = z.object({
  otp: otpField,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    otp: otpField.optional(),
    newPassword: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  identifier: identifierField,
});

export const resetPasswordSchema = z
  .object({
    otp: otpField,
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  email: z.email("Please provide a valid email address"),
  otp: otpField,
});

export const sendVerificationEmailSchema = z.object({
  email: z.email("Please provide a valid email address"),
});

export const updateTwoFactorSchema = z.object({
  enabled: z.boolean(),
  otp: otpField,
});

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must not exceed 100 characters")
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

/** Exactly one of email or phone for API bodies. */
export type AuthContactPayload =
  | { email: string; phone?: never }
  | { phone: string; email?: never };

export type LoginPayload = AuthContactPayload & { password: string };

export type RegisterPayload = AuthContactPayload & {
  password: string;
  fullName: string;
  bio?: string;
};

export type ForgotPasswordPayload = AuthContactPayload;

export type ResetPasswordPayload = AuthContactPayload & {
  otp: string;
  password: string;
};

export type VerifyLoginOtpPayload = AuthContactPayload & { otp: string };

/** Payload sent to POST /auth/change-password. */
export type ChangePasswordPayload = ChangePasswordFormData;

export function toLoginPayload(data: LoginFormData): LoginPayload {
  return {
    ...resolveAuthIdentifier(data.identifier),
    password: data.password,
  };
}

export function toRegisterPayload(data: RegisterFormData): RegisterPayload {
  const contact = resolveAuthIdentifier(data.identifier);
  return {
    ...contact,
    password: data.password,
    fullName: data.fullName,
    ...(data.bio ? { bio: data.bio } : {}),
  };
}

export function toForgotPasswordPayload(
  data: ForgotPasswordFormData,
): ForgotPasswordPayload {
  return resolveAuthIdentifier(data.identifier);
}
