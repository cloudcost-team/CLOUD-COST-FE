export function formatPercent(value: number | null) {
  return value === null ? "—" : `${value}%`;
}
