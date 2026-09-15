import type { GeoLocation } from "@/types/common";

export interface CreateEventPayload {
  title: string;
  description: string;
  coverImages?: string[];
  eventDate: string;
  reportingTime?: string;
  location: GeoLocation;
  price: number;
  currency?: string;
  maxParticipants: number;
  turf?: string;
  registrationsPaused?: boolean;
}

export type UpdateEventPayload = Partial<CreateEventPayload> & {
  archive?: boolean;
};

export interface HostEventStats {
  totalEvents: number;
  draftCount: number;
  pendingApprovalCount: number;
  publishedCount: number;
  rejectedCount: number;
  closedCount: number;
  totalRegistrations: number;
}
