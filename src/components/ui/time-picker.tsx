"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function TimePicker({
  id,
  value,
  onChange,
  className,
  disabled,
}: TimePickerProps) {
  return (
    <Input
      id={id}
      type="time"
      step={60}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("[&::-webkit-calendar-picker-indicator]:cursor-pointer", className)}
      disabled={disabled}
    />
  );
}
