export function turfDrawerUrl(drawer: "new" | string, mode?: "edit") {
  const params = new URLSearchParams({ drawer });
  if (mode) params.set("mode", mode);
  return `/host/turfs?${params.toString()}`;
}

export function bookingDrawerUrl(id: string) {
  return `/host/bookings?drawer=${encodeURIComponent(id)}`;
}
