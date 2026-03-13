import { IJwtPayload } from "@/types/auth";
import { decodeJwt } from "jose";

export const authTokenKey = "accessToken";

export const setAuthToken = (token: string) => {
  localStorage.setItem(authTokenKey, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(authTokenKey);
};

export const removeAuthToken = () => {
  localStorage.removeItem(authTokenKey);
};

export function isTokenValid(
  token: string | null = typeof window !== "undefined"
    ? localStorage.getItem(authTokenKey)
    : null,
) {
  if (!token) return { isValid: false };
  try {
    const payload = decodeJwt<IJwtPayload>(token);
    const isValid = !!payload.exp && payload.exp > Date.now() / 1000;
    return { isValid, payload };
  } catch (error) {
    console.error("Invalid token:", error);
    return { isValid: false };
  }
}
