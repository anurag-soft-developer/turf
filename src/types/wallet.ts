export interface PayoutDetails {
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}

export interface Wallet {
  _id: string;
  user: string;
  totalBalance: number;
  heldBalance: number;
  availableBalance: number;
  escrowBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  payoutDetails?: PayoutDetails;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePayoutDetailsPayload {
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}
