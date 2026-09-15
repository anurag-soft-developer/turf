"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { ENTITY_SEARCH_DEBOUNCE_MS, filterFieldInnerClass } from "./constants";
import { FilterField } from "./filter-field";

export function TextSearchFilterField({
  label,
  value,
  onChange,
  placeholder,
  clearLabel,
  startIcon = Search,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
  startIcon?: LucideIcon;
  className?: string;
}) {
  const [query, setQuery] = useState(value);
  const [debouncedQuery] = useDebounce(query, ENTITY_SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    onChange(debouncedQuery);
  }, [debouncedQuery, onChange]);

  const handleClear = () => {
    setQuery("");
    onChange("");
  };

  return (
    <FilterField
      label={label}
      showClear={Boolean(query)}
      onClear={handleClear}
      clearLabel={clearLabel}
      startIcon={startIcon}
      className={className}
    >
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(event) => setQuery(event.target.value)}
        className={cn(filterFieldInnerClass, "placeholder:text-muted-foreground")}
      />
    </FilterField>
  );
}
