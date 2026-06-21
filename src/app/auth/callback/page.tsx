"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken, setRefreshToken } from "@/lib/utils/auth.util";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { Suspense } from "react";

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}

function Component() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const refresh = searchParams.get("refresh");
  const err = searchParams.get("error");

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      if (refresh) {
        setRefreshToken(refresh);
      }
      router.replace(ROUTE_POINT.events);
    }
  }, [token, refresh, router]);

  if (err && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-red-600">Authentication failed: {err}</p>
          <button
            onClick={() => router.replace("/auth/login")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
