export type PayoutMethod = "upi" | "bank";
export type WalletType = "turf" | "event";

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
  eventWallet: WalletLaneBalance;
  payoutDetails?: PayoutDetails;
  availableBalance: number;
  turfAvailableBalance: number;
  eventAvailableBalance: number;
  createdAt: string;
  updatedAt: string;
}

export function getAvailableBalanceForLane(
  wallet: Pick<Wallet, "turfWallet" | "eventWallet">,
  walletType: WalletType,
): number {
  const lane = walletType === "turf" ? wallet.turfWallet : wallet.eventWallet;
  return lane.totalBalance - lane.heldBalance;
}

export function getTurfAvailableBalance(
  wallet: Pick<Wallet, "turfWallet" | "eventWallet">,
): number {
  return getAvailableBalanceForLane(wallet, "turf");
}

export function getEventAvailableBalance(
  wallet: Pick<Wallet, "turfWallet" | "eventWallet">,
): number {
  return getAvailableBalanceForLane(wallet, "event");
}

export interface UpdatePayoutDetailsPayload {
  primaryMethod?: PayoutMethod;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}
