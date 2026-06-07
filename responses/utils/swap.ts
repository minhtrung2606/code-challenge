export function parseAmount(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return 0;

  return amount;
}

export function formatAmount(value: number) {
  if (!Number.isFinite(value)) return "0";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value > 1 ? 6 : 8,
  }).format(value);
}

export function getPairRate({
  fromUsdRate,
  toUsdRate,
}: {
  fromUsdRate?: number;
  toUsdRate?: number;
}) {
  if (!fromUsdRate || !toUsdRate) return 0;

  return fromUsdRate / toUsdRate;
}
