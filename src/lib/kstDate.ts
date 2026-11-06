const kstDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatKstDate(date: Date) {
  return kstDateFormat.format(date);
}

const kstDateTimeFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatKstDateTime(isoString: string) {
  return kstDateTimeFormat.format(new Date(isoString)).replace(",", "");
}

const kstPartsFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const kstTimeFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "numeric",
  minute: "2-digit",
});

const kstMonthDayFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "long",
  day: "numeric",
});

function kstDayNumber(date: Date) {
  const [year, month, day] = kstPartsFormat.format(date).split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

export function kstDaysAgo(isoString: string, now = new Date()) {
  return kstDayNumber(now) - kstDayNumber(new Date(isoString));
}

export function formatKstTimeOrDate(isoString: string, now = new Date()) {
  const date = new Date(isoString);
  return kstDaysAgo(isoString, now) === 0
    ? kstTimeFormat.format(date)
    : kstMonthDayFormat.format(date);
}

export function formatKstRelative(isoString: string, now = new Date()) {
  const minutes = Math.floor((now.getTime() - Date.parse(isoString)) / 60_000);
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}시간 전`;
  return kstMonthDayFormat.format(new Date(isoString));
}

export function formatYearMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return `${year}년 ${month}월`;
}

export function formatMonthDay(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${month}/${day}`;
}

export function formatKoreanMonthDay(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${month}월 ${day}일`;
}

export function shiftYearMonth(yearMonth: string, months: number) {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function getMonthNumber(yearMonth: string) {
  return Number(yearMonth.split("-")[1]);
}
