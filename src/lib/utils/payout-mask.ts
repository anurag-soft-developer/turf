export function maskAccountNumber(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.length <= 4) return value;
  return `****${value.slice(-4)}`;
}

export function maskUpiId(value?: string): string | undefined {
  if (!value) return undefined;
  const atIndex = value.indexOf("@");
  if (atIndex <= 0) return value;
  const local = value.slice(0, atIndex);
  const domain = value.slice(atIndex);
  if (local.length <= 4) return value;
  return `${local.slice(0, 4)}****${domain}`;
}
