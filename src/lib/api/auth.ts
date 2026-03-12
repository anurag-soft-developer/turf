import api from './client';
import { API_CONFIG } from '@/lib/constants/api';
import type { AuthResponse, User } from '@/types/auth';
import type { RegisterFormData, LoginFormData } from '@/lib/schemas/auth';

export const authApi = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.patch(
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  verifyEmail: async (data: { otp: string; email: string }) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, data);
    return response.data;
  },

  sendVerificationEmail: async (email: string) => {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.AUTH.SEND_VERIFICATION,
      { email }
    );
    return response.data;
  },
};