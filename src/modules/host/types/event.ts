import type { User } from "@/types/auth";
import type { GeoLocation } from "@/types/common";

export type EventStatus =
  | "draft"
  | "pending_approval"
  | "published"
  | "rejected"
  | "closed";

export interface EventTurfRef {
  _id: string;
  name: string;
  location?: GeoLocation;
  images?: string[];
}

export interface HostEvent {
  _id: string;
  createdBy?: User | string;
  title: string;
  slug: string;
  description: string;
  coverImages?: string[];
  eventDate: string;
  reportingTime?: string;
  location: GeoLocation;
  price: number;
  currency: string;
  maxParticipants: number;
  registeredCount: number;
  turf?: EventTurfRef | string;
  status: EventStatus;
  isClosed: boolean;
  closedAt?: string;
  registrationsPaused: boolean;
  archive: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: User | string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
