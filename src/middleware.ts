import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDefaultHomeRoute,
  isPathAllowed,
} from "@/lib/constants/app-type";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPathAllowed(pathname)) {
    return NextResponse.next();
  }

  const home = getDefaultHomeRoute();
  const url = request.nextUrl.clone();
  url.pathname = home;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
