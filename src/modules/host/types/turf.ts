import type { GeoLocation } from "../../../types/common";

export interface TurfDimensions {
  length?: number;
  width?: number;
  unit?: string;
}

export interface TurfPricing {
  basePricePerHour: number;
  weekendSurge?: number;
}

export interface TurfOperatingHours {
  open?: string;
  close?: string;
}

export interface Turf {
  _id: string;
  name: string;
  description: string;
  location: GeoLocation;
  images?: string[];
  amenities?: string[];
  dimensions?: TurfDimensions;
  sportType: string[];
  pricing: TurfPricing;
  operatingHours?: TurfOperatingHours;
  isAvailable?: boolean;
  slotBufferMins?: number;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTurfPayload {
  name: string;
  description: string;
  location: GeoLocation;
  images?: string[];
  amenities?: string[];
  dimensions?: TurfDimensions;
  sportType: string[];
  pricing: TurfPricing;
  operatingHours?: TurfOperatingHours;
  isAvailable?: boolean;
  slotBufferMins?: number;
}

export type UpdateTurfPayload = Partial<CreateTurfPayload>;

export interface TurfStats {
  totalTurfs?: number;
  availableTurfs?: number;
  [key: string]: unknown;
}
