import { z } from "zod";
import type { CreateEventPayload } from "../types/event";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const eventFormSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required").max(10000),
    eventDate: z.string().min(1, "Date is required"),
    reportingTime: z
      .union([z.string().regex(timeRegex, "Use HH:MM format"), z.literal("")])
      .optional(),
    address: z.string().min(1, "Address is required"),
    latitude: z.number(),
    longitude: z.number(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    price: z.number().min(0, "Price must be 0 or more"),
    currency: z.string().length(3, "Use 3-letter currency code"),
    maxParticipants: z.number().int().min(1, "At least 1 participant required"),
    coverImages: z.array(z.string()).optional(),
    turfId: z.string().optional(),
    registrationsPaused: z.boolean(),
  })
  .refine((data) => !(data.latitude === 0 && data.longitude === 0), {
    message: "Select a location from the address suggestions",
    path: ["address"],
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function eventFormToCreatePayload(
  values: EventFormValues,
): CreateEventPayload {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    eventDate: values.eventDate,
    reportingTime: values.reportingTime?.trim() || undefined,
    location: {
      address: values.address.trim(),
      coordinates: {
        type: "Point",
        coordinates: [values.longitude, values.latitude],
      },
      city: values.city?.trim() || undefined,
      state: values.state?.trim() || undefined,
      zip: values.zip?.trim() || undefined,
      country: values.country?.trim() || undefined,
    },
    price: values.price,
    currency: values.currency.trim().toUpperCase(),
    maxParticipants: values.maxParticipants,
    coverImages: values.coverImages?.length ? values.coverImages : undefined,
    turf: values.turfId?.trim() || undefined,
    registrationsPaused: values.registrationsPaused,
  };
}
