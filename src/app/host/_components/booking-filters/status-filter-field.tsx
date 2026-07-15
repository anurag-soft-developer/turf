"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ListFilter } from "lucide-react";
import { ALL_FILTER, filterFieldInnerClass } from "./constants";
import { FilterField } from "./filter-field";

export interface StatusOption<T extends string = string> {
  label: string;
  value: T;
}

export function StatusFilterField<T extends string>({
  label,
  value,
  options,
  onChange,
  clearLabel = "Clear status filter",
  startIcon = ListFilter,
  className,
}: {
  label?: string;
  value: string;
  options: StatusOption<T>[];
  onChange: (value: string) => void;
  clearLabel?: string;
  startIcon?: LucideIcon;
  className?: string;
}) {
  return (
    <FilterField
      label={label ?? "Status"}
      showClear={value !== ALL_FILTER}
      onClear={() => onChange(ALL_FILTER)}
      clearLabel={clearLabel}
      startIcon={startIcon}
      className={className}
    >
      <div className="relative flex w-full items-center">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            filterFieldInnerClass,
            "cursor-pointer appearance-none pr-7",
          )}
        >
          <option value={ALL_FILTER}>All</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute h-4 w-4 text-muted-foreground",
            value !== ALL_FILTER ? "right-1" : "right-2",
          )}
        />
      </div>
    </FilterField>
  );
}
