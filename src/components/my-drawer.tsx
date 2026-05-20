"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MyDrawerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
  className?: string;
}

export function MyDrawer({
  title,
  onClose,
  children,
  direction = "right",
  className,
}: MyDrawerProps) {
  const [open, setOpen] = useState(true);
  const canDismissRef = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      canDismissRef.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const requestClose = () => {
    if (canDismissRef.current) setOpen(false);
  };

  return (
    <Drawer
      open={open}
      direction={direction}
      handleOnly
      onOpenChange={(nextOpen) => {
        if (!nextOpen && canDismissRef.current) setOpen(false);
      }}
      onAnimationEnd={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DrawerContent
        className={cn(
          "w-full !select-text sm:!max-w-2xl lg:!max-w-3xl",
          className,
        )}
      >
        <DrawerHeader className="flex flex-row items-center justify-between gap-4 border-b py-3">
          <div className="min-w-0 flex-1">
            <DrawerTitle className="text-lg">{title}</DrawerTitle>
            <DrawerDescription className="sr-only">{title}</DrawerDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={requestClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>
        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 select-text"
          data-vaul-no-drag
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
