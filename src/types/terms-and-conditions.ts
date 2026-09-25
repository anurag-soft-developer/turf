export const TermsAndConditionsKind = {
  TURF_OWNER: "turf_owner",
} as const;

export type TermsAndConditionsKindType =
  (typeof TermsAndConditionsKind)[keyof typeof TermsAndConditionsKind];

export type TermsAndConditionsStatus = "draft" | "published";

export interface TermsActor {
  _id: string;
  fullName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

export interface TermsAndConditions {
  _id: string;
  kind: TermsAndConditionsKindType;
  version: string;
  title: string;
  content: string;
  status: TermsAndConditionsStatus;
  createdBy: TermsActor | string;
  publishedBy?: TermsActor | string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveTermsDraftPayload {
  kind: TermsAndConditionsKindType;
  version: string;
  title: string;
  content: string;
}

export interface UpdateTermsDraftPayload {
  version: string;
  title: string;
  content: string;
}
