const numberFormat = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 2,
});

export function formatMoney(amount: number, currency: "KRW" | "USD") {
  return `${currency === "KRW" ? "₩" : "$"} ${numberFormat.format(amount)}`;
}

export function formatSignedMoney(amount: number, currency: "KRW" | "USD") {
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${currency === "KRW" ? "₩" : "$"} ${sign}${numberFormat.format(Math.abs(amount))}`;
}

export function formatSignedPercent(rate: number) {
  return `${rate > 0 ? "+" : ""}${rate}%`;
}
