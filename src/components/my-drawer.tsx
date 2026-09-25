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
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const DrawerFooterSlotContext = createContext<HTMLDivElement | null>(null);

export function DrawerFooter({ children }: { children: ReactNode }) {
  const slot = useContext(DrawerFooterSlotContext);
  if (!slot) return null;
  return createPortal(children, slot);
}

interface MyDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
  className?: string;
}

export function MyDrawer({
  open,
  onOpenChange,
  title,
  onClose,
  children,
  direction = "right",
  className,
}: MyDrawerProps) {
  const canDismissRef = useRef(false);
  const [footerSlot, setFooterSlot] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      canDismissRef.current = false;
      return;
    }
    const frame = requestAnimationFrame(() => {
      canDismissRef.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const requestClose = () => {
    if (canDismissRef.current) onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      direction={direction}
      handleOnly
      onOpenChange={(nextOpen) => {
        if (!nextOpen && canDismissRef.current) onOpenChange(false);
        if (nextOpen) onOpenChange(true);
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
        <DrawerFooterSlotContext.Provider value={footerSlot}>
          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 py-4 select-text"
            data-vaul-no-drag
          >
            {children}
          </div>
          <div
            ref={setFooterSlot}
            className="shrink-0 border-t bg-background px-4 py-3 empty:hidden"
          />
        </DrawerFooterSlotContext.Provider>
      </DrawerContent>
    </Drawer>
  );
}
