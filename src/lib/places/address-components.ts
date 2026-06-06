export interface ParsedAddressComponents {
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

function componentLongName(
  components: google.maps.places.AddressComponent[],
  type: string,
): string | undefined {
  const match = components.find((c) => c.types.includes(type));
  const name = match?.longText?.trim();
  return name || undefined;
}

export function parseAddressComponents(
  components: google.maps.places.AddressComponent[] | undefined,
): ParsedAddressComponents {
  if (!components?.length) return {};

  const city =
    componentLongName(components, "locality") ??
    componentLongName(components, "postal_town") ??
    componentLongName(components, "administrative_area_level_2");

  return {
    city,
    state: componentLongName(components, "administrative_area_level_1"),
    zip: componentLongName(components, "postal_code"),
    country: componentLongName(components, "country"),
  };
}
