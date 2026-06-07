"use client";

import { ROUTE_POINT } from "@/lib/constants/route-point";
import { isTokenValid } from "@/lib/utils/auth.util";
import { redirect } from "next/navigation";

interface iProps {
  children: React.ReactNode;
}

const ProtectedPage = ({ children }: iProps) => {
  const { isValid, payload } = isTokenValid();
  
  if (!isValid || !payload) {
    redirect(ROUTE_POINT.auth.login);
  }

  if (!payload.isEmailVerified) {
    redirect(ROUTE_POINT.auth.verifyEmail);
  }

  return children;
};

export default ProtectedPage;
