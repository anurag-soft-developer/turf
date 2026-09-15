"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  ENTITY_SEARCH_DEBOUNCE_MS,
  filterFieldInnerClass,
} from "./constants";

export interface EntitySearchFieldProps<T> {
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  searchResults: T[];
  isFetching: boolean;
  isError: boolean;
  selectedItem?: T;
  getItemId: (item: T) => string;
  formatLabel: (item: T) => string;
  onDebouncedQueryChange?: (query: string) => void;
  onOpenChange?: (open: boolean) => void;
  loadingLabel?: string;
  errorLabel?: string;
  emptyLabel?: string;
}

export function EntitySearchField<T>({
  value,
  onChange,
  placeholder,
  searchResults,
  isFetching,
  isError,
  selectedItem,
  getItemId,
  formatLabel,
  onDebouncedQueryChange,
  onOpenChange,
  loadingLabel = "Searching…",
  errorLabel = "Failed to load results.",
  emptyLabel = "No results found.",
}: EntitySearchFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, ENTITY_SEARCH_DEBOUNCE_MS);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    onDebouncedQueryChange?.(debouncedQuery);
  }, [debouncedQuery, onDebouncedQueryChange]);

  useEffect(() => {
    if (!value) {
      setQuery("");
      return;
    }
    if (selectedItem) {
      setQuery(formatLabel(selectedItem));
    }
  }, [value, selectedItem, formatLabel]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        if (selectedItem) {
          setQuery(formatLabel(selectedItem));
        } else if (!value) {
          setQuery("");
        }
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, selectedItem, value, formatLabel]);

  const selectItem = (item: T) => {
    onChange(getItemId(item));
    setQuery(formatLabel(item));
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          onChange("");
          setOpen(true);
        }}
        className={cn(filterFieldInnerClass, "placeholder:text-muted-foreground")}
        aria-expanded={open}
        aria-autocomplete="list"
        role="combobox"
      />

      {open ? (
        <ul
          className="absolute left-0 top-[calc(100%+4px)] z-50 max-h-52 w-full min-w-[260px] overflow-y-auto rounded-lg border border-input bg-popover p-1 shadow-md"
          role="listbox"
        >
          {isFetching ? (
            <li className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingLabel}
            </li>
          ) : isError ? (
            <li className="px-2 py-2 text-sm text-muted-foreground">
              {errorLabel}
            </li>
          ) : searchResults.length === 0 ? (
            <li className="px-2 py-2 text-sm text-muted-foreground">
              {emptyLabel}
            </li>
          ) : (
            searchResults.map((item) => {
              const itemId = getItemId(item);
              return (
                <li key={itemId}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === itemId}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectItem(item)}
                    className={cn(
                      "flex w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent",
                      value === itemId && "bg-accent",
                    )}
                  >
                    {formatLabel(item)}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
