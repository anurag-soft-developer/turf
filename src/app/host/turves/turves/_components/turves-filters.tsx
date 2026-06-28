"use client";

import { BookingFiltersBar } from "@/app/host/_components/booking-filters/booking-filters-bar";
import { ALL_FILTER } from "@/app/host/_components/booking-filters/constants";
import { StatusFilterField } from "@/app/host/_components/booking-filters/status-filter-field";
import { TextSearchFilterField } from "@/app/host/_components/booking-filters/text-search-filter-field";
import { turfStatusLabel } from "@/lib/utils/turf-display";
import type { TurfStatus } from "@/types/turf";

export { ALL_FILTER } from "@/app/host/_components/booking-filters/constants";

const STATUS_OPTIONS: { label: string; value: TurfStatus }[] = (
  ["draft", "pending_approval", "published", "rejected"] as TurfStatus[]
).map((value) => ({
  value,
  label: turfStatusLabel(value),
}));

const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "true" },
  { label: "Unavailable", value: "false" },
] as const;

export interface TurvesFilterState {
  selectedStatus: string;
  searchText: string;
  availability: string;
}

interface TurvesFiltersProps extends TurvesFilterState {
  onStatusChange: (status: string) => void;
  onSearchChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
  onClear: () => void;
}

export function TurvesFilters({
  selectedStatus,
  searchText,
  availability,
  onStatusChange,
  onSearchChange,
  onAvailabilityChange,
  onClear,
}: TurvesFiltersProps) {
  const hasActiveFilters =
    selectedStatus !== ALL_FILTER ||
    Boolean(searchText.trim()) ||
    availability !== ALL_FILTER;

  return (
    <BookingFiltersBar hasActiveFilters={hasActiveFilters} onClear={onClear}>
      <StatusFilterField
        value={selectedStatus}
        options={STATUS_OPTIONS}
        onChange={onStatusChange}
        className="max-w-[200px]"
      />

      <TextSearchFilterField
        label="Search"
        value={searchText}
        onChange={onSearchChange}
        placeholder="Search turfs…"
        clearLabel="Clear search filter"
        className="max-w-[260px]"
      />

      <StatusFilterField
        label="Availability"
        value={availability}
        options={[...AVAILABILITY_OPTIONS]}
        onChange={onAvailabilityChange}
        clearLabel="Clear availability filter"
        className="max-w-[180px]"
      />
    </BookingFiltersBar>
  );
}

export const EMPTY_TURVES_FILTERS: TurvesFilterState = {
  selectedStatus: ALL_FILTER,
  searchText: "",
  availability: ALL_FILTER,
};
