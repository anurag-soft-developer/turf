"use client";

import { Input } from "@/components/ui/input";
import { FilterField } from "./filter-field";

export function DateFilterField({
  label,
  value,
  min,
  onChange,
  clearLabel,
  className,
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
  clearLabel: string;
  className?: string;
}) {
  return (
    <FilterField
      label={label}
      showClear={Boolean(value)}
      onClear={() => onChange("")}
      clearLabel={clearLabel}
      className={className}
    >
      <Input
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 rounded-none border-0 shadow-none focus-visible:ring-0"
      />
    </FilterField>
  );
}
