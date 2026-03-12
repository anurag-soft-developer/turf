import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { IJwtPayload } from "./types/auth";

const authRoutes = ["login", "register"];
const protectedRoutes = ["dashboard", "profile", "notifications", "settings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("accessToken")?.value;
  const { isValid, payload } = isTokenValid(sessionToken);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.includes(`${route}`),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.includes(`${route}`));

  console.log("Proxy Middleware:", {
    pathname,
    isValid,
    isProtectedRoute,
    isAuthRoute,
    payload,
    sessionToken,
  });

  if (!isValid && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isValid && !payload?.isEmailVerified && isProtectedRoute) {
    const verifyEmailUrl = new URL("/auth/verify-email", request.url);
    return NextResponse.redirect(verifyEmailUrl);
  }

  if (isValid && isAuthRoute) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/notifications/:path*",
    "/settings/:path*",
  ],
};

function isTokenValid(token: string | undefined) {
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
