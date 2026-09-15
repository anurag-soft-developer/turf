import type { PayoutDetails, PayoutMethod } from "@/types/wallet";
import { z } from "zod";

const bankPayoutSchema = z.object({
  payoutType: z.literal("bank"),
  accountHolderName: z.string().trim().min(2).max(120),
  bankName: z.string().trim().min(2).max(120),
  accountNumber: z
    .string()
    .trim()
    .min(6)
    .max(34)
    .regex(/^[0-9]+$/, "Account number must contain digits only"),
  ifscCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
});

const upiPayoutSchema = z.object({
  payoutType: z.literal("upi"),
  upiId: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9.\-_]{2,256}@[a-z]{2,64}$/, "Invalid UPI ID"),
});

export const payoutDetailsFormSchema = z.discriminatedUnion("payoutType", [
  bankPayoutSchema,
  upiPayoutSchema,
]);

export type PayoutDetailsFormData = z.infer<typeof payoutDetailsFormSchema>;

export const withdrawalRequestFormSchema = z.object({
  amount: z.number().min(1, "Minimum withdrawal amount is ₹1"),
});

export type WithdrawalRequestFormData = z.infer<
  typeof withdrawalRequestFormSchema
>;

export function hasUpiData(payoutDetails?: PayoutDetails): boolean {
  return Boolean(payoutDetails?.upiId?.trim());
}

export function hasBankData(payoutDetails?: PayoutDetails): boolean {
  if (!payoutDetails) return false;
  return (
    Boolean(payoutDetails.accountHolderName?.trim()) ||
    Boolean(payoutDetails.bankName?.trim()) ||
    Boolean(payoutDetails.accountNumber?.trim()) ||
    Boolean(payoutDetails.ifscCode?.trim())
  );
}

export function hasCompleteUpiDetails(payoutDetails?: PayoutDetails): boolean {
  if (!payoutDetails) return false;
  return (
    typeof payoutDetails.upiId === "string" &&
    /^[a-z0-9.\-_]{2,256}@[a-z]{2,64}$/.test(payoutDetails.upiId)
  );
}

export function hasCompleteBankDetails(payoutDetails?: PayoutDetails): boolean {
  if (!payoutDetails) return false;

  const accountNumber = payoutDetails.accountNumber?.trim();
  const ifscCode = payoutDetails.ifscCode?.trim();

  return (
    Boolean(payoutDetails.accountHolderName?.trim()) &&
    Boolean(payoutDetails.bankName?.trim()) &&
    Boolean(accountNumber) &&
    Boolean(ifscCode) &&
    /^[0-9]+$/.test(accountNumber!) &&
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode!.toUpperCase())
  );
}

export function resolvePrimaryMethod(
  payoutDetails?: PayoutDetails,
): PayoutMethod | undefined {
  if (!payoutDetails) return undefined;

  if (payoutDetails.primaryMethod) {
    return payoutDetails.primaryMethod;
  }

  const hasUpi = hasCompleteUpiDetails(payoutDetails);
  const hasBank = hasCompleteBankDetails(payoutDetails);

  if (hasUpi && !hasBank) return "upi";
  if (hasBank && !hasUpi) return "bank";

  return undefined;
}

export function hasCompletePayoutDetails(
  payoutDetails?: PayoutDetails,
): boolean {
  const method = resolvePrimaryMethod(payoutDetails);
  if (!method) return false;

  return method === "upi"
    ? hasCompleteUpiDetails(payoutDetails)
    : hasCompleteBankDetails(payoutDetails);
}

export function payoutMethodLabel(method: PayoutMethod): string {
  return method === "upi" ? "UPI" : "Bank account";
}
