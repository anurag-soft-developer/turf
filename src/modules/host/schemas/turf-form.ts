import { z } from "zod";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const turfFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number(),
  longitude: z.number(),
  sportTypes: z.array(z.string()).min(1, "Select at least one sport"),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  basePricePerHour: z.number().min(0, "Price must be 0 or more"),
  weekendSurge: z.number().min(0).max(1),
  openTime: z.string().regex(timeRegex, "Use HH:MM format"),
  closeTime: z.string().regex(timeRegex, "Use HH:MM format"),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  dimensionUnit: z.enum(["meters", "feet"]),
  isAvailable: z.boolean(),
  slotBufferMins: z.number().min(0).max(120),
});

export type TurfFormValues = z.infer<typeof turfFormSchema>;

export const SPORT_TYPES = [
  "Football",
  "Cricket",
  "Basketball",
  "Tennis",
  "Volleyball",
  "Badminton",
  "Hockey",
  "Baseball",
  "Soccer",
] as const;

export const AMENITIES = [
  "Parking",
  "Restrooms",
  "Changing Rooms",
  "Lighting",
  "Refreshments",
  "Equipment Rental",
  "First Aid",
  "Security",
  "Wi-Fi",
  "Seating Area",
] as const;

export function turfFormToCreatePayload(values: TurfFormValues) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    location: {
      address: values.address.trim(),
      coordinates: {
        type: "Point" as const,
        coordinates: [values.longitude, values.latitude] as [number, number],
      },
    },
    sportType: values.sportTypes,
    amenities: values.amenities?.length ? values.amenities : undefined,
    images: values.images?.length ? values.images : undefined,
    pricing: {
      basePricePerHour: values.basePricePerHour,
      weekendSurge: values.weekendSurge,
    },
    operatingHours: {
      open: values.openTime,
      close: values.closeTime,
    },
    dimensions:
      values.length != null || values.width != null
        ? {
            length: values.length,
            width: values.width,
            unit: values.dimensionUnit,
          }
        : undefined,
    isAvailable: values.isAvailable,
    slotBufferMins: values.slotBufferMins,
  };
}
