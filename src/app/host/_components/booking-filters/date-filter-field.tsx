"use client";

import { Input } from "@/components/ui/input";
import { FilterField } from "./filter-field";

export function DateFilterField({
  label,
  value,
  min,
  onChange,
  clearLabel,
  clearToValue,
  className,
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
  clearLabel: string;
  clearToValue?: string;
  className?: string;
}) {
  const resetValue = clearToValue ?? "";
  const showClear = clearToValue ? value !== clearToValue : Boolean(value);

  return (
    <FilterField
      label={label}
      showClear={showClear}
      onClear={() => onChange(resetValue)}
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
