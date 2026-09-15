export interface PaginatedResponse<T> {
  data: T[];
  totalDocuments: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface GeoLocation {
  address: string;
  coordinates: GeoPoint;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

/** Matches turf-services nearbyLocationQuerySchema. */
export interface NearbyLocationQuery {
  nearbyLat: number;
  nearbyLng: number;
  nearbyRadiusKm?: number;
}
