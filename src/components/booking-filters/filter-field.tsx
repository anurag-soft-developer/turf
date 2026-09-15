"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import { filterFieldShellClass } from "./constants";

export function FilterField({
  label,
  children,
  onClear,
  showClear,
  clearLabel,
  startIcon: StartIcon,
  className,
}: {
  label: string;
  children: React.ReactNode;
  onClear: () => void;
  showClear: boolean;
  clearLabel: string;
  startIcon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("min-w-[140px] flex-1 space-y-1", className)}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className={filterFieldShellClass}>
        {StartIcon ? (
          <StartIcon className="ml-2.5 h-4 w-4 shrink-0 text-emerald-600" />
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={clearLabel}
            className="mr-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
