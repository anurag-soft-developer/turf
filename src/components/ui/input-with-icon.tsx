import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputWithIconProps = React.ComponentProps<"input"> & {
  icon: LucideIcon;
  endAdornment?: React.ReactNode;
};

function InputWithIcon({
  icon: Icon,
  endAdornment,
  className,
  ...props
}: InputWithIconProps) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
      <Input
        className={cn("pl-9", endAdornment && "pr-10", className)}
        {...props}
      />
      {endAdornment ? (
        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          {endAdornment}
        </div>
      ) : null}
    </div>
  );
}

export { InputWithIcon };
