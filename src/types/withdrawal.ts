import type { User } from "./auth";

export type WithdrawalStatus =
  | "pending"
  | "approved"
  | "processing"
  | "settled"
  | "rejected"
  | "cancelled";

export interface WithdrawalComment {
  addedBy: User | string;
  message: string;
  createdAt: string;
}

export interface Withdrawal {
  _id: string;
  requestedBy: User | string;
  amount: number;
  status: WithdrawalStatus;
  comments: WithdrawalComment[];
  attachments: string[];
  rejectionReason?: string;
  reviewedBy?: User | string;
  reviewedAt?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalsFilter {
  status?: WithdrawalStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface CreateWithdrawalPayload {
  amount: number;
}

export interface UpdateWithdrawalStatusPayload {
  status: WithdrawalStatus;
  rejectionReason?: string;
}

export interface AddWithdrawalCommentPayload {
  message: string;
}

export interface AddWithdrawalAttachmentsPayload {
  attachments: string[];
}
