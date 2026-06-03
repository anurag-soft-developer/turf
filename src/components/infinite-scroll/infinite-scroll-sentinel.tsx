"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useScrollableListRoot } from "./scrollable-list-context";

export type InfiniteScrollSentinelProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
};

export function InfiniteScrollSentinel({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isError,
  onRetry,
  className,
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollRoot = useScrollableListRoot();
  const fetchingRef = useRef(isFetchingNextPage);

  fetchingRef.current = isFetchingNextPage;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;

    const root = scrollRoot?.current ?? null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasNextPage &&
          !fetchingRef.current
        ) {
          fetchNextPage();
        }
      },
      { root, rootMargin: "80px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, scrollRoot]);

  if (!hasNextPage && !isError) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {hasNextPage ? (
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
      ) : null}
      {isError && onRetry ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <p className="text-sm text-muted-foreground">Failed to load more.</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
      {isFetchingNextPage ? (
        <div className="flex justify-center py-6" aria-live="polite">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : null}
    </div>
  );
}
