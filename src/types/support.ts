import type { User } from "./auth";

export type SupportQueryStatus = "open" | "in_progress" | "resolved";

export type SupportReplyAuthorRole = "user" | "platform_admin";

export interface SupportReply {
  _id?: string;
  authorId: User | string;
  authorRole: SupportReplyAuthorRole;
  body: string;
  createdAt: string;
}

export interface SupportInternalNote {
  _id?: string;
  authorId: User | string;
  body: string;
  createdAt: string;
}

export interface SupportQuery {
  _id: string;
  userId: User | string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  status: SupportQueryStatus;
  replies: SupportReply[];
  internalNotes?: SupportInternalNote[];
  resolvedBy?: User | string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportQueriesFilter {
  status?: SupportQueryStatus;
  userId?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface AddSupportReplyPayload {
  body: string;
}

export interface AddSupportInternalNotePayload {
  body: string;
}

export interface UpdateSupportQueryStatusPayload {
  status: SupportQueryStatus;
}
