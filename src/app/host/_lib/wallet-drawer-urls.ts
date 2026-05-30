export function walletDrawerUrl(id: string) {
  return `/host/wallet?drawer=${id}`;
}

export function adminWithdrawalDrawerUrl(id: string) {
  return `/platform-admin/withdrawals?drawer=${id}`;
}
