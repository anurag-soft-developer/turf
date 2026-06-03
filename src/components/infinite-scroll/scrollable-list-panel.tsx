"use client";

import { cn } from "@/lib/utils";
import { useRef, type ReactNode } from "react";
import { INFINITE_LIST_SCROLL_MIN_HEIGHT_PX } from "./constants";
import { ScrollableListContext } from "./scrollable-list-context";

export type ScrollableListPanelProps = {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  scrollClassName?: string;
};

export function ScrollableListPanel({
  header,
  children,
  className,
  scrollClassName,
}: ScrollableListPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollableListContext.Provider value={scrollRef}>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          className,
        )}
      >
        {header ? <div className="shrink-0">{header}</div> : null}
        <div
          ref={scrollRef}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            scrollClassName,
          )}
          style={{ minHeight: INFINITE_LIST_SCROLL_MIN_HEIGHT_PX }}
        >
          {children}
        </div>
      </div>
    </ScrollableListContext.Provider>
  );
}
