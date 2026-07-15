"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import { SearchMultiSelect } from "@/components/search-multi-select";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { storageApi } from "@/lib/api/storage";
import ENV_CONFIG from "@/config/env.config";
import {
  AMENITY_OPTIONS,
  isSportTypeValue,
  SPORT_TYPE_OPTIONS,
  turfFormSchema,
  turfFormToCreatePayload,
  type TurfFormValues,
} from "@/modules/host/schemas/turf-form";
import type { Turf } from "@/modules/host/types/turf";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clock,
  FileText,
  ImageIcon,
  IndianRupee,
  MapPin,
  Percent,
  Search,
  Trophy,
  Type,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

function turfToDefaultValues(turf?: Turf): TurfFormValues {
  return {
    name: turf?.name ?? "",
    description: turf?.description ?? "",
    address: turf?.location?.address ?? "",
    latitude: turf?.location?.coordinates?.coordinates?.[1] ?? 0,
    longitude: turf?.location?.coordinates?.coordinates?.[0] ?? 0,
    city: turf?.location?.city ?? "",
    state: turf?.location?.state ?? "",
    zip: turf?.location?.zip ?? "",
    country: turf?.location?.country ?? "",
    sportTypes: (turf?.sportType ?? []).filter(isSportTypeValue),
    amenities: turf?.amenities ?? [],
    images: turf?.images ?? [],
    basePricePerHour: turf?.pricing?.basePricePerHour ?? 500,
    weekendSurge: turf?.pricing?.weekendSurge ?? 0.2,
    openTime: turf?.operatingHours?.open ?? "06:00",
    closeTime: turf?.operatingHours?.close ?? "22:00",
    length: turf?.dimensions?.length,
    width: turf?.dimensions?.width,
    dimensionUnit: (turf?.dimensions?.unit as "meters" | "feet") ?? "meters",
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
  const mapsError = !ENV_CONFIG.GOOGLE_MAPS_API_KEY
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
  const city = watch("city") ?? "";
  const stateName = watch("state") ?? "";
  const openTime = watch("openTime") ?? "06:00";
  const closeTime = watch("closeTime") ?? "22:00";

  const removeImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, imageIndex) => imageIndex !== index),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await storageApi.uploadFile(file, "turfMedia");
      setValue("images", [...images, url], {
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
      onSubmit={handleSubmit((values) => onSubmit(turfFormToCreatePayload(values)))}
    >
      <div className="space-y-4 px-4 py-4 pb-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-emerald-600" />
            Name
          </Label>
          <InputWithIcon id="name" icon={Type} {...register("name")} />
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            Description
          </Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description ? (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            Address
          </Label>
          <PlacesAutocomplete
            key={turf?._id ?? "new"}
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

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-emerald-600" />
            Sport types
          </Label>
          <SearchMultiSelect
            options={SPORT_TYPE_OPTIONS}
            value={sportTypes}
            onChange={(next) =>
              setValue("sportTypes", next as TurfFormValues["sportTypes"], {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            placeholder="Search sports…"
            searchPlaceholder="Add another sport…"
            startIcon={Search}
          />
          {errors.sportTypes ? (
            <p className="text-sm text-destructive">
              {errors.sportTypes.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5 text-emerald-600" />
            Amenities
          </Label>
          <SearchMultiSelect
            options={AMENITY_OPTIONS}
            value={amenities}
            onChange={(next) =>
              setValue("amenities", next, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            placeholder="Search amenities…"
            searchPlaceholder="Add another amenity…"
            startIcon={Search}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="basePricePerHour" className="flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
              Base price / hour (₹)
            </Label>
            <InputWithIcon
              id="basePricePerHour"
              icon={IndianRupee}
              type="number"
              {...register("basePricePerHour", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekendSurge" className="flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-emerald-600" />
              Weekend surge (0–1)
            </Label>
            <InputWithIcon
              id="weekendSurge"
              icon={Percent}
              type="number"
              step="0.01"
              {...register("weekendSurge", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="openTime" className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              Opens
            </Label>
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
            <Label htmlFor="closeTime" className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              Closes
            </Label>
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

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
            Images
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
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          {images.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {images.map((url, index) => (
                <div key={`${url}-${index}`} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="h-20 w-20 rounded-lg object-cover ring-1 ring-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
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
