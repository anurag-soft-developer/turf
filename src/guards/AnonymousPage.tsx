"use client";

import { isTokenValid } from "@/lib/utils/auth.util";
import { redirect } from "next/navigation";
import React from "react";

interface iProps {
  children: React.ReactNode;
}

const AnonymousPage = ({ children }: iProps) => {
  
  const { isValid, payload } = isTokenValid();

  if (isValid && payload?.sub) {
    redirect("/dashboard");
  }

  return children;
};

export default AnonymousPage;
