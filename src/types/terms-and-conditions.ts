export const TermsAndConditionsKind = {
  TURF_OWNER: "turf_owner",
  EVENT_BOOKING: "event_booking",
  EVENT_HOST: "event_host",
} as const;

export type TermsAndConditionsKindType =
  (typeof TermsAndConditionsKind)[keyof typeof TermsAndConditionsKind];

export const TERMS_KIND_OPTIONS: {
  value: TermsAndConditionsKindType;
  label: string;
}[] = [
  { value: TermsAndConditionsKind.TURF_OWNER, label: "Turf owner" },
  { value: TermsAndConditionsKind.EVENT_BOOKING, label: "Event booking" },
  { value: TermsAndConditionsKind.EVENT_HOST, label: "Event host" },
];

export function termsKindLabel(kind: TermsAndConditionsKindType) {
  return (
    TERMS_KIND_OPTIONS.find((option) => option.value === kind)?.label ?? kind
  );
}

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
