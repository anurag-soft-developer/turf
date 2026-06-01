"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { hostStorageApi } from "@/modules/host/api/storage";
import {
  AMENITIES,
  SPORT_TYPES,
  turfFormSchema,
  turfFormToCreatePayload,
  type TurfFormValues,
} from "@/modules/host/schemas/turf-form";
import type { Turf } from "@/modules/host/types/turf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

function turfToDefaultValues(turf?: Turf): TurfFormValues {
  return {
    name: turf?.name ?? "",
    description: turf?.description ?? "",
    address: turf?.location?.address ?? "",
    latitude: turf?.location?.coordinates?.coordinates?.[1] ?? 0,
    longitude: turf?.location?.coordinates?.coordinates?.[0] ?? 0,
    sportTypes: turf?.sportType ?? [],
    amenities: turf?.amenities ?? [],
    images: turf?.images ?? [],
    basePricePerHour: turf?.pricing?.basePricePerHour ?? 500,
    weekendSurge: turf?.pricing?.weekendSurge ?? 0.2,
    openTime: turf?.operatingHours?.open ?? "06:00",
    closeTime: turf?.operatingHours?.close ?? "22:00",
    length: turf?.dimensions?.length,
    width: turf?.dimensions?.width,
    dimensionUnit: (turf?.dimensions?.unit as "meters" | "feet") ?? "meters",
    isAvailable: turf?.isAvailable ?? true,
    slotBufferMins: turf?.slotBufferMins ?? 15,
  };
}

interface TurfFormProps {
  turf?: Turf;
  onSubmit: (payload: ReturnType<typeof turfFormToCreatePayload>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export default function TurfForm({
  turf,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = "Save turf",
}: TurfFormProps) {
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
  } = useForm<TurfFormValues>({
    resolver: zodResolver(turfFormSchema),
    defaultValues: turfToDefaultValues(turf),
  });
  const sportTypes = watch("sportTypes") ?? [];
  const amenities = watch("amenities") ?? [];
  const images = watch("images") ?? [];
  const address = watch("address") ?? "";
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const openTime = watch("openTime") ?? "06:00";
  const closeTime = watch("closeTime") ?? "22:00";
  console.log(errors,watch());

  const toggleItem = (
    field: "sportTypes" | "amenities",
    value: string,
    current: string[],
  ) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next, { shouldValidate: true });
  };

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await hostStorageApi.uploadFile(file, "turfMedia");
      setValue("images", [...images, url], { shouldValidate: true });
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
      onSubmit={handleSubmit((values) => onSubmit(turfFormToCreatePayload(values)))}
    >
      <div className="space-y-8 px-4 py-4 pb-2">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Basic info</h3>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description ? (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Location</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <PlacesAutocomplete
            key={turf?._id ?? "new"}
            id="address"
            value={address}
            onAddressChange={(next) =>
              setValue("address", next, { shouldValidate: true, shouldDirty: true })
            }
            onPlaceSelect={({ address: nextAddress, latitude: lat, longitude: lng }) => {
              setValue("address", nextAddress, { shouldValidate: true, shouldDirty: true });
              setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
              setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
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
        <h3 className="text-lg font-semibold">Sports & amenities</h3>
        <div>
          <Label>Sport types</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SPORT_TYPES.map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() => toggleItem("sportTypes", sport, sportTypes)}
                className={`rounded-full px-3 py-1 text-sm ring-1 ${
                  sportTypes.includes(sport)
                    ? "bg-emerald-600 text-white ring-emerald-600"
                    : "bg-white text-gray-700 ring-gray-200"
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
          {errors.sportTypes ? (
            <p className="mt-1 text-sm text-destructive">
              {errors.sportTypes.message}
            </p>
          ) : null}
        </div>
        <div>
          <Label>Amenities</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AMENITIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem("amenities", item, amenities)}
                className={`rounded-full px-3 py-1 text-sm ring-1 ${
                  amenities.includes(item)
                    ? "bg-emerald-600 text-white ring-emerald-600"
                    : "bg-white text-gray-700 ring-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing & hours</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="basePricePerHour">Base price / hour (₹)</Label>
            <Input
              id="basePricePerHour"
              type="number"
              {...register("basePricePerHour", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekendSurge">Weekend surge (0–1)</Label>
            <Input
              id="weekendSurge"
              type="number"
              step="0.01"
              {...register("weekendSurge", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="openTime">Opens</Label>
            <TimePicker
              id="openTime"
              value={openTime}
              onChange={(value) =>
                setValue("openTime", value, { shouldValidate: true, shouldDirty: true })
              }
            />
            {errors.openTime ? (
              <p className="text-sm text-destructive">{errors.openTime.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="closeTime">Closes</Label>
            <TimePicker
              id="closeTime"
              value={closeTime}
              onChange={(value) =>
                setValue("closeTime", value, { shouldValidate: true, shouldDirty: true })
              }
            />
            {errors.closeTime ? (
              <p className="text-sm text-destructive">{errors.closeTime.message}</p>
            ) : null}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isAvailable")} />
          Available for bookings
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Images</h3>
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
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        {images.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {images.map((url) => (
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
            {isSubmitting ? "Saving…" : submitLabel}
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
