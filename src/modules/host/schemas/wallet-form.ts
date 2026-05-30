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

export function hasCompletePayoutDetails(
  payoutDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  },
): boolean {
  if (!payoutDetails) return false;

  const hasUpi =
    typeof payoutDetails.upiId === "string" &&
    /^[a-z0-9.\-_]{2,256}@[a-z]{2,64}$/.test(payoutDetails.upiId);

  const accountNumber = payoutDetails.accountNumber?.trim();
  const ifscCode = payoutDetails.ifscCode?.trim();

  const hasBank =
    Boolean(payoutDetails.accountHolderName?.trim()) &&
    Boolean(payoutDetails.bankName?.trim()) &&
    Boolean(accountNumber) &&
    Boolean(ifscCode);

  return hasUpi || hasBank;
}
