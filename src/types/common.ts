export interface PaginatedResponse<T> {
  data: T[];
  totalDocuments: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GeoLocation {
  address: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}
