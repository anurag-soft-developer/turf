"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function AlertDialog(props: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root {...props} />;
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return <AlertDialogPrimitive.Trigger {...props} />;
}

function AlertDialogContent({
  className,
  children,
  ...props
}: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPrimitive.Portal className="fixed inset-0 z-[100] pointer-events-none">
      <AlertDialogPrimitive.Backdrop className="fixed inset-0 bg-black/50 pointer-events-auto" />
      <AlertDialogPrimitive.Viewport className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <AlertDialogPrimitive.Popup
          className={cn(
            "pointer-events-auto w-full max-w-md rounded-xl border bg-background p-6 shadow-lg outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <AlertDialogPrimitive.Close
      render={<Button variant="outline" className={className} />}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn("bg-destructive text-white hover:bg-destructive/90", className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};
