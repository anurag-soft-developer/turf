/** Matches turf-services Profile (UsersService.sanitizeProfile). */
export const UserRole = {
  PLATFORM_ADMIN: "platform_admin",
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  _id: string;
  email?: string;
  role: UserRoleType | string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  notificationsEnabled?: boolean;
  notificationModules?: Record<string, boolean>;
  isPasswordExists?: boolean;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

/** Matches turf-services IAuthResponse. */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/** Matches turf-services IAuthOtpChallengeResponse (login with 2FA). */
export interface AuthOtpChallengeResponse {
  message: string;
  requiresOtp: true;
  channel: "email" | "sms";
  email?: string;
  phone?: string;
}

/** Matches GET /auth/status response. */
export interface AuthStatusResponse {
  isAuthenticated: true;
  user: User;
}

/** Matches POST /auth/verify-email response body. */
export interface VerifyEmailResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  message: string;
}

/** Matches turf-services IJwtPayload. */
export interface IJwtPayload {
  sub: string;
  email?: string;
  phone?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  role: string;
  iat?: number;
  exp?: number;
}

export function isAuthOtpChallenge(
  response: AuthResponse | AuthOtpChallengeResponse,
): response is AuthOtpChallengeResponse {
  return "requiresOtp" in response && response.requiresOtp === true;
}

export function isAuthResponse(
  response: AuthResponse | AuthOtpChallengeResponse,
): response is AuthResponse {
  return "accessToken" in response;
}

export function isPlatformAdmin(user: User | undefined): boolean {
  return user?.role === UserRole.PLATFORM_ADMIN;
}
