import api from './client';
import { API_CONFIG } from '@/lib/constants/api';
import type { AuthResponse, User } from '@/types/auth';
import type { RegisterFormData, LoginFormData } from '@/lib/schemas/auth';

export const authApi = {
  // Register new user
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  // Login user
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  // Change password
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

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (data: { token: string; newPassword: string }) => {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  // Verify email
  verifyEmail: async (data: { token: string; email: string }) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, data);
    return response.data;
  },

  // Send verification email
  sendVerificationEmail: async (email: string) => {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.AUTH.SEND_VERIFICATION,
      { email }
    );
    return response.data;
  },
};