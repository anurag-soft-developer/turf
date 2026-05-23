export type RazorpayHostKycStatus =
  | "not_started"
  | "pending"
  | "under_review"
  | "needs_clarification"
  | "activated"
  | "rejected"
  | "suspended";

export interface HostOnboardingStatus {
  razorpayKycStatus: RazorpayHostKycStatus;
  statusMessage?: string;
  canPublishTurfs: boolean;
  legalBusinessName?: string;
  appliedAt?: string;
  activatedAt?: string;
}

export function defaultHostOnboardingStatus(): HostOnboardingStatus {
  return {
    razorpayKycStatus: "not_started",
    canPublishTurfs: false,
  };
}

export interface ApplyHostOnboardingPayload {
  legalBusinessName: string;
  contactName: string;
  phone: string;
  businessType:
    | "individual"
    | "proprietorship"
    | "partnership"
    | "private_limited"
    | "public_limited"
    | "llp"
    | "trust"
    | "society"
    | "ngo"
    | "not_yet_registered"
    | "educational_institutes"
    | "other";
  category: string;
  subcategory: string;
  pan: string;
  gst?: string;
  registeredAddress: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  bankAccountNumber: string;
  bankIfsc: string;
  bankBeneficiaryName: string;
}

export function isHostOnboardingComplete(status?: HostOnboardingStatus): boolean {
  return status?.canPublishTurfs === true;
}

export function isHostOnboardingInProgress(
  status?: HostOnboardingStatus,
): boolean {
  if (!status) return false;
  return [
    "pending",
    "under_review",
    "needs_clarification",
  ].includes(status.razorpayKycStatus);
}

export function needsHostOnboarding(status?: HostOnboardingStatus): boolean {
  if (!status) return true;
  return !isHostOnboardingComplete(status);
}
