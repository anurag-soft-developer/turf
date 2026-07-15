"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { storageApi } from "@/lib/api/storage";
import ENV_CONFIG from "@/config/env.config";
import {
  eventFormSchema,
  eventFormToCreatePayload,
  type EventFormValues,
} from "@/modules/host/schemas/event-form";
import type { HostEvent } from "@/modules/host/types/event";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  FileText,
  ImageIcon,
  IndianRupee,
  MapPin,
  Type,
  Users,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

function toDateInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toLocalDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  const mapsError = !ENV_CONFIG.GOOGLE_MAPS_API_KEY
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
  const city = watch("city") ?? "";
  const stateName = watch("state") ?? "";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minEventDate = toLocalDateInputValue(tomorrow);

  const removeCoverImage = (index: number) => {
    setValue(
      "coverImages",
      coverImages.filter((_, imageIndex) => imageIndex !== index),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await storageApi.uploadFile(file, "turfMedia");
      setValue("coverImages", [...coverImages, url], {
        shouldValidate: true,
        shouldDirty: true,
      });
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
      <div className="space-y-4 px-4 py-4 pb-2">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-emerald-600" />
            Title
          </Label>
          <InputWithIcon id="title" icon={Type} {...register("title")} />
          {errors.title ? (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            Description
          </Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description ? (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="eventDate" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              Event date
            </Label>
            <InputWithIcon
              id="eventDate"
              icon={Calendar}
              type="date"
              min={minEventDate}
              {...register("eventDate")}
            />
            {errors.eventDate ? (
              <p className="text-sm text-destructive">{errors.eventDate.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reportingTime" className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              Reporting time (optional)
            </Label>
            <InputWithIcon
              id="reportingTime"
              icon={Clock}
              type="time"
              {...register("reportingTime")}
            />
            {errors.reportingTime ? (
              <p className="text-sm text-destructive">{errors.reportingTime.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            Address
          </Label>
          <PlacesAutocomplete
            key={event?._id ?? "new"}
            id="address"
            value={address}
            errorMessage={errors.address?.message}
            helperText={!mapsError && (city || stateName) ? [city, stateName].filter(Boolean).join(", ") : undefined}
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
        </div>
        {mapsError ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <InputWithIcon
                id="latitude"
                icon={MapPin}
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
              <InputWithIcon
                id="longitude"
                icon={MapPin}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
              Price
            </Label>
            <InputWithIcon
              id="price"
              icon={IndianRupee}
              type="number"
              {...register("price", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxParticipants" className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-emerald-600" />
              Max participants
            </Label>
            <InputWithIcon
              id="maxParticipants"
              icon={Users}
              type="number"
              {...register("maxParticipants", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
            Cover images
          </Label>
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
            <div className="flex flex-wrap gap-3">
              {coverImages.map((url, index) => (
                <div key={`${url}-${index}`} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="h-20 w-20 rounded-lg object-cover ring-1 ring-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeCoverImage(index)}
                    aria-label="Remove cover image"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/85 text-white hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
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
