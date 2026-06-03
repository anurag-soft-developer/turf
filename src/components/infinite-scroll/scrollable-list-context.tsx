"use client";

import { createContext, useContext, type RefObject } from "react";

export const ScrollableListContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useScrollableListRoot() {
  return useContext(ScrollableListContext);
}
