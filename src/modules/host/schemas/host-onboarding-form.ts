import { z } from "zod";
import type { ApplyHostOnboardingPayload } from "../types/host-onboarding";

export const hostOnboardingFormSchema = z.object({
  legalBusinessName: z.string().min(4, "Business name is required"),
  contactName: z.string().min(4, "Contact name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  businessType: z.enum([
    "individual",
    "proprietorship",
    "partnership",
    "private_limited",
    "public_limited",
    "llp",
    "trust",
    "society",
    "ngo",
    "not_yet_registered",
    "educational_institutes",
    "other",
  ]),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN (e.g. ABCDE1234F)"),
  gst: z.string().optional(),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  bankAccountNumber: z.string().min(5, "Account number is required"),
  bankIfsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code"),
  bankBeneficiaryName: z.string().min(1, "Beneficiary name is required"),
});

export type HostOnboardingFormValues = z.infer<typeof hostOnboardingFormSchema>;

export function hostOnboardingFormToPayload(
  values: HostOnboardingFormValues,
): ApplyHostOnboardingPayload {
  return {
    legalBusinessName: values.legalBusinessName,
    contactName: values.contactName,
    phone: values.phone,
    businessType: values.businessType,
    category: values.category,
    subcategory: values.subcategory,
    pan: values.pan.toUpperCase(),
    gst: values.gst || undefined,
    registeredAddress: {
      street1: values.street1,
      street2: values.street2,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: "IN",
    },
    bankAccountNumber: values.bankAccountNumber,
    bankIfsc: values.bankIfsc.toUpperCase(),
    bankBeneficiaryName: values.bankBeneficiaryName,
  };
}
