import { z } from "zod";
import type { WithdrawalStatus } from "@/types/withdrawal";

export const addCommentFormSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

export const addAttachmentsFormSchema = z.object({
  attachments: z
    .array(z.string().url("Each attachment must be a valid URL"))
    .min(1)
    .max(10),
});

export const updateStatusFormSchema = z
  .object({
    status: z.enum([
      "pending",
      "approved",
      "processing",
      "settled",
      "rejected",
      "cancelled",
    ]),
    rejectionReason: z.string().trim().max(1000).optional(),
  })
  .refine(
    (data) =>
      data.status !== "rejected" ||
      Boolean(data.rejectionReason?.trim()),
    { message: "Rejection reason is required", path: ["rejectionReason"] },
  );

export type AddCommentFormData = z.infer<typeof addCommentFormSchema>;
export type AddAttachmentsFormData = z.infer<typeof addAttachmentsFormSchema>;
export type UpdateStatusFormData = z.infer<typeof updateStatusFormSchema>;

const transitionMap: Record<WithdrawalStatus, WithdrawalStatus[]> = {
  pending: ["approved", "rejected", "cancelled"],
  approved: ["processing", "rejected", "cancelled"],
  processing: ["settled", "rejected"],
  rejected: [],
  settled: [],
  cancelled: [],
};

export function getAllowedNextStatuses(
  current: WithdrawalStatus,
): WithdrawalStatus[] {
  return transitionMap[current] ?? [];
}

export function formatWithdrawalStatus(status: WithdrawalStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
