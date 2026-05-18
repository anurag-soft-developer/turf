"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  isSubmitting?: boolean;
  submitLabel?: string;
}

export default function TurfForm({
  turf,
  onSubmit,
  isSubmitting,
  submitLabel = "Save turf",
}: TurfFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TurfFormValues>({
    resolver: zodResolver(turfFormSchema),
    defaultValues: turfToDefaultValues(turf),
  });

  const sportTypes = watch("sportTypes") ?? [];
  const amenities = watch("amenities") ?? [];
  const images = watch("images") ?? [];

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

  return (
    <form
      className="space-y-8"
      onSubmit={handleSubmit((values) => onSubmit(turfFormToCreatePayload(values)))}
    >
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
          <Input id="address" {...register("address")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" type="number" step="any" {...register("latitude")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" type="number" step="any" {...register("longitude")} />
          </div>
        </div>
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
              {...register("basePricePerHour")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekendSurge">Weekend surge (0–1)</Label>
            <Input
              id="weekendSurge"
              type="number"
              step="0.01"
              {...register("weekendSurge")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="openTime">Opens</Label>
            <Input id="openTime" {...register("openTime")} placeholder="06:00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closeTime">Closes</Label>
            <Input id="closeTime" {...register("closeTime")} placeholder="22:00" />
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

      <Button type="submit" disabled={isSubmitting || uploading} className="w-full sm:w-auto">
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
