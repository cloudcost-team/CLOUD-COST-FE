import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import type { Currency } from "@/api/costs";

const hoursFormat = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 2,
});

export function formatHours(hours: number) {
  return `${hoursFormat.format(hours)}시간`;
}

export function formatHourlyCost(amount: number, currency: Currency) {
  if (currency === "USD") return `$ ${amount.toFixed(4)}`;
  return `₩ ${new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(amount)}`;
}

export function formatSignedRate(rate: number) {
  return `${rate > 0 ? "+" : ""}${rate.toFixed(1)}%`;
}

export function formatShortDate(isoDate: string) {
  return format(parseISO(isoDate), "MM/dd");
}

export function formatShortDateWithWeekday(isoDate: string) {
  return format(parseISO(isoDate), "MM/dd (EEE)", { locale: ko });
}

export function formatLongDateWithWeekday(isoDate: string) {
  return format(parseISO(isoDate), "M월 d일 (EEE)", { locale: ko });
}

export function formatDotDate(isoDate: string) {
  return isoDate.replaceAll("-", ".");
}

export function formatDateRange(from: string, to: string) {
  const end =
    from.slice(0, 4) === to.slice(0, 4)
      ? formatDotDate(to.slice(5))
      : formatDotDate(to);
  return `${formatDotDate(from)} ~ ${end}`;
}
