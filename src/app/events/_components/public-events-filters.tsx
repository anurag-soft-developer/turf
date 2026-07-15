"use client";

import { DateFilterField } from "@/app/host/_components/booking-filters/date-filter-field";
import { filterFieldInnerClass } from "@/app/host/_components/booking-filters/constants";
import { FilterField } from "@/app/host/_components/booking-filters/filter-field";
import { TextSearchFilterField } from "@/app/host/_components/booking-filters/text-search-filter-field";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronDown, MapPin, ArrowUpDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

export function todayDateInputValue() {
  return format(new Date(), "yyyy-MM-dd");
}

export type PublicEventsSortValue =
  | ""
  | "eventDate:asc"
  | "eventDate:desc"
  | "price:asc"
  | "price:desc";

const SORT_OPTIONS: Array<{ value: PublicEventsSortValue; label: string }> = [
  { value: "", label: "Recommended" },
  { value: "eventDate:asc", label: "Soonest first" },
  { value: "eventDate:desc", label: "Latest first" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
];

export interface PublicEventsFilterState {
  searchText: string;
  city: string;
  startDate: string;
  endDate: string;
  sort: PublicEventsSortValue;
}

export const EMPTY_PUBLIC_EVENTS_FILTERS: PublicEventsFilterState = {
  searchText: "",
  city: "",
  startDate: todayDateInputValue(),
  endDate: "",
  sort: "",
};

interface PublicEventsFiltersProps extends PublicEventsFilterState {
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSortChange: (value: PublicEventsSortValue) => void;
  onClearAll: () => void;
}

function CityFilterField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleAddressChange = (next: string) => {
    setInputValue(next);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <FilterField
      label="City"
      showClear={Boolean(value.trim())}
      onClear={handleClear}
      clearLabel="Clear city filter"
      startIcon={MapPin}
    >
      <PlacesAutocomplete
        id="event-city"
        cityOnly
        value={inputValue}
        onAddressChange={handleAddressChange}
        onPlaceSelect={(place) => {
          const nextCity = (place.city ?? place.address).trim();
          setInputValue(nextCity);
          onChange(nextCity);
        }}
        placeholder="Search city"
      />
    </FilterField>
  );
}

export function PublicEventsFilters({
  searchText,
  city,
  startDate,
  endDate,
  sort,
  onSearchChange,
  onCityChange,
  onStartDateChange,
  onEndDateChange,
  onSortChange,
  onClearAll,
}: PublicEventsFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const today = todayDateInputValue();
  const endDateMin = startDate && startDate >= today ? startDate : today;

  const hasActiveFilters =
    Boolean(searchText.trim()) ||
    Boolean(city.trim()) ||
    startDate !== today ||
    Boolean(endDate) ||
    sort !== "";

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClearAll();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div
        className={cn(
          "flex items-center justify-between gap-2",
          isOpen && "mb-3 border-b border-gray-100 pb-2",
        )}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            Filters
          </h2>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={handleClearAll}
            aria-label="Clear all filters"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {isOpen ? (
      <div className="space-y-3">
        <TextSearchFilterField
          label="Search"
          value={searchText}
          onChange={onSearchChange}
          placeholder="Search events…"
          clearLabel="Clear search filter"
        />

        <CityFilterField value={city} onChange={onCityChange} />

        <DateFilterField
          label="Event from"
          value={startDate}
          min={today}
          clearToValue={today}
          onChange={onStartDateChange}
          clearLabel="Clear start date filter"
        />

        <DateFilterField
          label="Event to"
          value={endDate}
          min={endDateMin}
          onChange={onEndDateChange}
          clearLabel="Clear end date filter"
        />

        <FilterField
          label="Sort by"
          showClear={sort !== ""}
          onClear={() => onSortChange("")}
          clearLabel="Clear sort filter"
          startIcon={ArrowUpDown}
        >
          <div className="relative flex w-full items-center">
            <select
              id="event-sort"
              value={sort}
              onChange={(event) =>
                onSortChange(event.target.value as PublicEventsSortValue)
              }
              className={cn(
                filterFieldInnerClass,
                "cursor-pointer appearance-none pr-7 text-xs",
              )}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value || "recommended"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute h-4 w-4 text-muted-foreground",
                sort !== "" ? "right-1" : "right-2",
              )}
            />
          </div>
        </FilterField>
      </div>
      ) : null}
    </div>
  );
}

export function parsePublicEventsSort(sort: Exclude<PublicEventsSortValue, "">): {
  sortBy: string;
  sortOrder: "asc" | "desc";
} {
  const [sortBy, sortOrder] = sort.split(":") as [string, "asc" | "desc"];
  return { sortBy, sortOrder };
}
