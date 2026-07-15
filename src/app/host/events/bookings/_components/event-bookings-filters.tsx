"use client";

import { BookingFiltersBar } from "@/app/host/_components/booking-filters/booking-filters-bar";
import { ALL_FILTER } from "@/app/host/_components/booking-filters/constants";
import { DateFilterField } from "@/app/host/_components/booking-filters/date-filter-field";
import { EntitySearchField } from "@/app/host/_components/booking-filters/entity-search-field";
import { FilterField } from "@/app/host/_components/booking-filters/filter-field";
import { StatusFilterField } from "@/app/host/_components/booking-filters/status-filter-field";
import {
  useHostEvent,
  useSearchMyEvents,
} from "@/modules/host/hooks/use-my-events";
import type { HostEvent } from "@/modules/host/types/event";
import type { EventBookingStatus } from "@/modules/host/types/owner-event-booking";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useCallback, useState } from "react";

export { ALL_FILTER } from "@/app/host/_components/booking-filters/constants";

const STATUS_OPTIONS: { label: string; value: EventBookingStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

function formatEventLabel(event: HostEvent) {
  const dateLabel = event.eventDate
    ? format(new Date(event.eventDate), "MMM d, yyyy")
    : "";
  return dateLabel ? `${event.title} · ${dateLabel}` : event.title;
}

function EventSearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: selectedEventData } = useHostEvent(value);
  const {
    data: searchResults,
    isFetching,
    isError,
  } = useSearchMyEvents(searchQuery, { enabled: dropdownOpen });

  const getItemId = useCallback((event: HostEvent) => event._id, []);

  return (
    <EntitySearchField
      value={value}
      onChange={onChange}
      placeholder="Search events…"
      searchResults={searchResults?.data ?? []}
      isFetching={isFetching}
      isError={isError}
      selectedItem={selectedEventData}
      getItemId={getItemId}
      formatLabel={formatEventLabel}
      onDebouncedQueryChange={setSearchQuery}
      onOpenChange={setDropdownOpen}
      loadingLabel="Searching events…"
      errorLabel="Failed to load events."
      emptyLabel="No events found."
    />
  );
}

export interface EventBookingsFilterState {
  selectedStatus: string;
  selectedEventId: string;
  startDate: string;
  endDate: string;
}

interface EventBookingsFiltersProps extends EventBookingsFilterState {
  onStatusChange: (status: string) => void;
  onEventChange: (eventId: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
}

export function EventBookingsFilters({
  selectedStatus,
  selectedEventId,
  startDate,
  endDate,
  onStatusChange,
  onEventChange,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: EventBookingsFiltersProps) {
  const hasActiveFilters =
    selectedStatus !== ALL_FILTER ||
    Boolean(selectedEventId) ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <BookingFiltersBar hasActiveFilters={hasActiveFilters} onClear={onClear}>
      <StatusFilterField
        value={selectedStatus}
        options={STATUS_OPTIONS}
        onChange={onStatusChange}
        className="max-w-[180px]"
      />

      <FilterField
        label="Event"
        showClear={Boolean(selectedEventId)}
        onClear={() => onEventChange("")}
        clearLabel="Clear event filter"
        startIcon={CalendarDays}
        className="max-w-[260px]"
      >
        <EventSearchField value={selectedEventId} onChange={onEventChange} />
      </FilterField>

      <DateFilterField
        label="Booked from"
        value={startDate}
        onChange={onStartDateChange}
        clearLabel="Clear start date filter"
        className="max-w-[180px]"
      />

      <DateFilterField
        label="Booked to"
        value={endDate}
        min={startDate || undefined}
        onChange={onEndDateChange}
        clearLabel="Clear end date filter"
        className="max-w-[180px]"
      />
    </BookingFiltersBar>
  );
}

export const EMPTY_EVENT_BOOKINGS_FILTERS: EventBookingsFilterState = {
  selectedStatus: ALL_FILTER,
  selectedEventId: "",
  startDate: "",
  endDate: "",
};
