import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

const authRoutes = ["login", "register"];
const protectedRoutes = ["dashboard", "profile"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("accessToken")?.value;
  const isValidToken = isTokenValid(sessionToken);

  if (
    !isValidToken &&
    protectedRoutes.some((route) => pathname.includes(`${route}`))
  ) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isValidToken &&
    authRoutes.some((route) => pathname.includes(`${route}`))
  ) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/:path*"],
};

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const payload = decodeJwt(token);
    return !!payload.exp && payload.exp > Date.now() / 1000;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}
