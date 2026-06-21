"use client";

import { ROUTE_POINT } from "@/lib/constants/route-point";
import { isTokenValid } from "@/lib/utils/auth.util";
import { redirect } from "next/navigation";
import React from "react";

interface iProps {
  children: React.ReactNode;
}

const AnonymousPage = ({ children }: iProps) => {
  
  const { isValid, payload } = isTokenValid();

  if (isValid && payload?.sub) {
    redirect(ROUTE_POINT.events);
  }

  return children;
};

export default AnonymousPage;
