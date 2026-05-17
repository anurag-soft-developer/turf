import api from "./client";
import { API_CONFIG } from "@/lib/constants/api";
import type {
  AuthOtpChallengeResponse,
  AuthResponse,
  AuthStatusResponse,
  MessageResponse,
  User,
  VerifyEmailResponse,
} from "@/types/auth";
import type {
  ChangePasswordPayload,
  LoginFormData,
  RegisterFormData,
  ResetPasswordPayload,
  UpdateNotificationSettingsFormData,
  UpdateProfileFormData,
  UpdateTwoFactorFormData,
  VerifyEmailFormData,
  VerifyLoginOtpFormData,
} from "@/lib/schemas/auth";

export const authApi = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const { bio, phone, ...rest } = data;
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      {
        ...rest,
        ...(phone ? { phone } : {}),
        ...(bio ? { bio } : {}),
      },
    );
    return response.data;
  },

  login: async (
    data: LoginFormData,
  ): Promise<AuthResponse | AuthOtpChallengeResponse> => {
    const response = await api.post<AuthResponse | AuthOtpChallengeResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      data,
    );
    return response.data;
  },

  verifyLoginOtp: async (
    data: VerifyLoginOtpFormData,
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN_VERIFY_OTP,
      data,
    );
    return response.data;
  },

  logout: async (): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
    );
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
    );
    return response.data;
  },

  getAuthStatus: async (): Promise<AuthStatusResponse> => {
    const response = await api.get<AuthStatusResponse>(
      API_CONFIG.ENDPOINTS.AUTH.STATUS,
    );
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>(API_CONFIG.ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileFormData): Promise<User> => {
    const response = await api.patch<User>(
      API_CONFIG.ENDPOINTS.USERS.PROFILE,
      data,
    );
    return response.data;
  },

  updateNotificationSettings: async (
    data: UpdateNotificationSettingsFormData,
  ): Promise<User> => {
    const response = await api.patch<User>(
      API_CONFIG.ENDPOINTS.USERS.NOTIFICATION_SETTINGS,
      data,
    );
    return response.data;
  },

  changePassword: async (
    data: ChangePasswordPayload,
  ): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data,
    );
    return response.data;
  },

  sendChangePasswordOtp: async (): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD_SEND_OTP,
    );
    return response.data;
  },

  sendTwoFactorOtp: async (): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      API_CONFIG.ENDPOINTS.AUTH.TWO_FACTOR_SEND_OTP,
    );
    return response.data;
  },

  updateTwoFactor: async (
    data: UpdateTwoFactorFormData,
  ): Promise<User> => {
    const response = await api.patch<User>(
      API_CONFIG.ENDPOINTS.AUTH.TWO_FACTOR_SETTING,
      data,
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
    );
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordPayload,
  ): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      data,
    );
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailFormData): Promise<VerifyEmailResponse> => {
    const response = await api.post<VerifyEmailResponse>(
      API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL,
      data,
    );
    return response.data;
  },

  sendVerificationEmail: async (email: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SEND_VERIFICATION,
      { email },
    );
    return response.data;
  },
};
