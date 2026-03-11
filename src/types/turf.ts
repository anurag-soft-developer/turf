export interface Sport {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isPopular?: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface Turf {
  id: string;
  name: string;
  description: string;
  location: Location;
  sports: Sport[];
  images: string[];
  amenities: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  reviewCount: number;
  isActive: boolean;
  timeSlots?: TimeSlot[];
}

export interface TurfSearchParams {
  sport?: string;
  location?: string;
  date?: string;
  priceRange?: [number, number];
  amenities?: string[];
  rating?: number;
}