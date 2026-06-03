export type TurfStatus =
  | "draft"
  | "pending_approval"
  | "published"
  | "rejected";

export type TurfReviewAction = "publish" | "reject";

export interface ReviewTurfPayload {
  action: TurfReviewAction;
  rejectionReason?: string;
}
