"use client";

import { BookingFiltersBar } from "@/app/host/_components/booking-filters/booking-filters-bar";
import { ALL_FILTER } from "@/app/host/_components/booking-filters/constants";
import { DateFilterField } from "@/app/host/_components/booking-filters/date-filter-field";
import { EntitySearchField } from "@/app/host/_components/booking-filters/entity-search-field";
import { FilterField } from "@/app/host/_components/booking-filters/filter-field";
import { StatusFilterField } from "@/app/host/_components/booking-filters/status-filter-field";
import {
  useHostTurf,
  useSearchMyTurfs,
} from "@/modules/host/hooks/use-my-turfs";
import type { TurfBookingStatus } from "@/modules/host/types/owner-booking";
import type { Turf } from "@/modules/host/types/turf";
import { useCallback, useState } from "react";

export { ALL_FILTER } from "@/app/host/_components/booking-filters/constants";

const STATUS_OPTIONS: { label: string; value: TurfBookingStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

function formatTurfLabel(turf: Turf) {
  const city = turf.location?.city;
  return city ? `${turf.name} · ${city}` : turf.name;
}

function TurfSearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: selectedTurfData } = useHostTurf(value);
  const {
    data: searchResults,
    isFetching,
    isError,
  } = useSearchMyTurfs(searchQuery, { enabled: dropdownOpen });

  const getItemId = useCallback((turf: Turf) => turf._id, []);

  return (
    <EntitySearchField
      value={value}
      onChange={onChange}
      placeholder="Search turfs…"
      searchResults={searchResults?.data ?? []}
      isFetching={isFetching}
      isError={isError}
      selectedItem={selectedTurfData}
      getItemId={getItemId}
      formatLabel={formatTurfLabel}
      onDebouncedQueryChange={setSearchQuery}
      onOpenChange={setDropdownOpen}
      loadingLabel="Searching turfs…"
      errorLabel="Failed to load turfs."
      emptyLabel="No turfs found."
    />
  );
}

export interface TurfBookingsFilterState {
  selectedStatus: string;
  selectedTurfId: string;
  startDate: string;
  endDate: string;
}

interface TurfBookingsFiltersProps extends TurfBookingsFilterState {
  onStatusChange: (status: string) => void;
  onTurfChange: (turfId: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
}

export function TurfBookingsFilters({
  selectedStatus,
  selectedTurfId,
  startDate,
  endDate,
  onStatusChange,
  onTurfChange,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: TurfBookingsFiltersProps) {
  const hasActiveFilters =
    selectedStatus !== ALL_FILTER ||
    Boolean(selectedTurfId) ||
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
        label="Turf"
        showClear={Boolean(selectedTurfId)}
        onClear={() => onTurfChange("")}
        clearLabel="Clear turf filter"
        className="max-w-[260px]"
      >
        <TurfSearchField value={selectedTurfId} onChange={onTurfChange} />
      </FilterField>

      <DateFilterField
        label="Slot from"
        value={startDate}
        onChange={onStartDateChange}
        clearLabel="Clear start date filter"
        className="max-w-[180px]"
      />

      <DateFilterField
        label="Slot to"
        value={endDate}
        min={startDate || undefined}
        onChange={onEndDateChange}
        clearLabel="Clear end date filter"
        className="max-w-[180px]"
      />
    </BookingFiltersBar>
  );
}

export const EMPTY_TURF_BOOKINGS_FILTERS: TurfBookingsFilterState = {
  selectedStatus: ALL_FILTER,
  selectedTurfId: "",
  startDate: "",
  endDate: "",
};
