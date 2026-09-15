"use client";

import { Button } from "@/components/ui/button";

export function BookingFiltersBar({
  hasActiveFilters,
  onClear,
  children,
}: {
  hasActiveFilters: boolean;
  onClear: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-900">Filters</p>
        {hasActiveFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end gap-3">{children}</div>
    </div>
  );
}
