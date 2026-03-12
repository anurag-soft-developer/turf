
export interface User {
  _id: string;
  email: string;
  role: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  iat?: number;
  exp?: number;
}