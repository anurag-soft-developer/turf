"use client";

import { BookingFiltersBar } from "@/app/host/_components/booking-filters/booking-filters-bar";
import { ALL_FILTER } from "@/app/host/_components/booking-filters/constants";
import { DateFilterField } from "@/app/host/_components/booking-filters/date-filter-field";
import { StatusFilterField } from "@/app/host/_components/booking-filters/status-filter-field";
import { TextSearchFilterField } from "@/app/host/_components/booking-filters/text-search-filter-field";
import { eventStatusLabel } from "@/lib/utils/event-display";
import type { EventStatus } from "@/modules/host/types/event";
import { PauseCircle } from "lucide-react";

export { ALL_FILTER } from "@/app/host/_components/booking-filters/constants";

const STATUS_OPTIONS: { label: string; value: EventStatus }[] = (
  [
    "draft",
    "pending_approval",
    "published",
    "rejected",
    "closed",
  ] as EventStatus[]
).map((value) => ({
  value,
  label: eventStatusLabel(value),
}));

const REGISTRATIONS_OPTIONS = [
  { label: "Open for bookings", value: "false" },
  { label: "Bookings on hold", value: "true" },
] as const;

export interface EventsFilterState {
  selectedStatus: string;
  searchText: string;
  registrations: string;
  startDate: string;
  endDate: string;
}

interface EventsFiltersProps extends EventsFilterState {
  onStatusChange: (status: string) => void;
  onSearchChange: (value: string) => void;
  onRegistrationsChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
}

export function EventsFilters({
  selectedStatus,
  searchText,
  registrations,
  startDate,
  endDate,
  onStatusChange,
  onSearchChange,
  onRegistrationsChange,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: EventsFiltersProps) {
  const hasActiveFilters =
    selectedStatus !== ALL_FILTER ||
    Boolean(searchText.trim()) ||
    registrations !== ALL_FILTER ||
    Boolean(startDate) ||
    Boolean(endDate);

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
        placeholder="Search events…"
        clearLabel="Clear search filter"
        className="max-w-[260px]"
      />

      <DateFilterField
        label="Event from"
        value={startDate}
        onChange={onStartDateChange}
        clearLabel="Clear start date filter"
        className="max-w-[180px]"
      />

      <DateFilterField
        label="Event to"
        value={endDate}
        min={startDate || undefined}
        onChange={onEndDateChange}
        clearLabel="Clear end date filter"
        className="max-w-[180px]"
      />

      <StatusFilterField
        label="Registrations"
        value={registrations}
        options={[...REGISTRATIONS_OPTIONS]}
        onChange={onRegistrationsChange}
        clearLabel="Clear registrations filter"
        startIcon={PauseCircle}
        className="max-w-[220px]"
      />
    </BookingFiltersBar>
  );
}

export const EMPTY_EVENTS_FILTERS: EventsFilterState = {
  selectedStatus: ALL_FILTER,
  searchText: "",
  registrations: ALL_FILTER,
  startDate: "",
  endDate: "",
};
