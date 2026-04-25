export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function discountPercent(price: number, original?: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}
