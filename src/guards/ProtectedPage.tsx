"use client";

import { isTokenValid } from "@/lib/utils/auth.util";
import { redirect } from "next/navigation";

interface iProps {
  children: React.ReactNode;
}

const ProtectedPage = ({ children }: iProps) => {
  const { isValid, payload } = isTokenValid();

  if (!isValid || !payload) {
    redirect("/auth/login");
  }

  if (!payload.isEmailVerified) {
    redirect("/auth/verify-email");
  }

  return children;
};

export default ProtectedPage;
