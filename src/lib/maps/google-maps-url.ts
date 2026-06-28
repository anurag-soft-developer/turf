import type { GeoLocation } from "@/types/common";

export function getGoogleMapsUrl(location: GeoLocation): string {
  const [lng, lat] = location.coordinates?.coordinates ?? [];
  if (lat != null && lng != null && !(lat === 0 && lng === 0)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
}
