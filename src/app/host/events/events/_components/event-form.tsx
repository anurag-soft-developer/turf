"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { storageApi } from "@/lib/api/storage";
import {
  eventFormSchema,
  eventFormToCreatePayload,
  type EventFormValues,
} from "@/modules/host/schemas/event-form";
import type { HostEvent } from "@/modules/host/types/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

function toDateInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function eventToDefaultValues(event?: HostEvent): EventFormValues {
  return {
    title: event?.title ?? "",
    description: event?.description ?? "",
    eventDate: toDateInputValue(event?.eventDate),
    reportingTime: event?.reportingTime ?? "",
    address: event?.location?.address ?? "",
    latitude: event?.location?.coordinates?.coordinates?.[1] ?? 0,
    longitude: event?.location?.coordinates?.coordinates?.[0] ?? 0,
    city: event?.location?.city ?? "",
    state: event?.location?.state ?? "",
    zip: event?.location?.zip ?? "",
    country: event?.location?.country ?? "",
    price: event?.price ?? 0,
    currency: event?.currency ?? "INR",
    maxParticipants: event?.maxParticipants ?? 10,
    coverImages: event?.coverImages ?? [],
    turfId:
      typeof event?.turf === "string"
        ? event.turf
        : (event?.turf?._id ?? ""),
    registrationsPaused: event?.registrationsPaused ?? false,
  };
}

interface EventFormProps {
  event?: HostEvent;
  onSubmit: (payload: ReturnType<typeof eventFormToCreatePayload>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export default function EventForm({
  event,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = "Save event",
}: EventFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const mapsError = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    ? "Google Maps API key is not configured"
    : null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: eventToDefaultValues(event),
  });

  const coverImages = watch("coverImages") ?? [];
  const address = watch("address") ?? "";
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await storageApi.uploadFile(file, "turfMedia");
      setValue("coverImages", [...coverImages, url], { shouldValidate: true });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleCancel = () => {
    if (!onCancel) return;
    if (isDirty) {
      setDiscardDialogOpen(true);
      return;
    }
    onCancel();
  };

  return (
    <form
      className="-mx-4 flex min-h-full flex-col"
      onSubmit={handleSubmit((values) => onSubmit(eventFormToCreatePayload(values)))}
    >
      <div className="space-y-8 px-4 py-4 pb-2">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Basic info</h3>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title ? (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...register("description")} />
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Schedule</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event date</Label>
              <Input id="eventDate" type="date" {...register("eventDate")} />
              {errors.eventDate ? (
                <p className="text-sm text-destructive">{errors.eventDate.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportingTime">Reporting time (optional)</Label>
              <Input id="reportingTime" type="time" {...register("reportingTime")} />
              {errors.reportingTime ? (
                <p className="text-sm text-destructive">{errors.reportingTime.message}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Location</h3>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <PlacesAutocomplete
              key={event?._id ?? "new"}
              id="address"
              value={address}
              onAddressChange={(next) =>
                setValue("address", next, { shouldValidate: true, shouldDirty: true })
              }
              onPlaceSelect={({
                address: nextAddress,
                latitude: lat,
                longitude: lng,
                city,
                state,
                zip,
                country,
              }) => {
                setValue("address", nextAddress, { shouldValidate: true, shouldDirty: true });
                setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
                setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
                setValue("city", city ?? "", { shouldDirty: true });
                setValue("state", state ?? "", { shouldDirty: true });
                setValue("zip", zip ?? "", { shouldDirty: true });
                setValue("country", country ?? "", { shouldDirty: true });
              }}
            />
            {errors.address ? (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            ) : null}
            {!mapsError && (latitude !== 0 || longitude !== 0) ? (
              <p className="text-xs text-muted-foreground">
                Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            ) : null}
          </div>
          {mapsError ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) =>
                    setValue("latitude", Number(e.target.value), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) =>
                    setValue("longitude", Number(e.target.value), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Pricing</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" maxLength={3} {...register("currency")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                {...register("maxParticipants", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="turfId">Linked turf ID (optional)</Label>
              <Input id="turfId" {...register("turfId")} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("registrationsPaused")} />
            Pause registrations
          </label>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Cover Images</h3>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload image"}
          </Button>
          {coverImages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {coverImages.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover ring-1 ring-gray-200"
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <div className="sticky bottom-0 z-10 shrink-0 border-t bg-background px-4 py-3">
        <div className="flex justify-end gap-2">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting || uploading}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || uploading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={discardDialogOpen}
        onOpenChange={setDiscardDialogOpen}
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to leave?"
        confirmLabel="Discard"
        destructive
        onConfirm={() => {
          setDiscardDialogOpen(false);
          onCancel?.();
        }}
      />
    </form>
  );
}
