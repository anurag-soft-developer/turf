export type PayoutMethod = "upi" | "bank";

export interface PayoutDetails {
  primaryMethod?: PayoutMethod;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}

export interface WalletLaneBalance {
  totalBalance: number;
  heldBalance: number;
  escrowBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
}

export interface Wallet {
  _id: string;
  user: string;
  turfWallet: WalletLaneBalance;
  payoutDetails?: PayoutDetails;
  createdAt: string;
  updatedAt: string;
}

export function getTurfAvailableBalance(
  wallet: Pick<Wallet, "turfWallet">,
): number {
  return wallet.turfWallet.totalBalance - wallet.turfWallet.heldBalance;
}

export interface UpdatePayoutDetailsPayload {
  primaryMethod?: PayoutMethod;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}
