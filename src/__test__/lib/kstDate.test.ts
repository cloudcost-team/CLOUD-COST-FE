import { describe, expect, it } from "vitest";
import { formatKstDate } from "@/lib/kstDate";

describe("formatKstDate", () => {
  it("KST 날짜를 YYYY-MM-DD로 반환한다", () => {
    expect(formatKstDate(new Date("2026-11-06T03:00:00Z"))).toBe("2026-11-06");
  });

  it("UTC로는 전날이어도 KST 자정 이후면 KST 날짜를 반환한다", () => {
    expect(formatKstDate(new Date("2026-11-05T15:30:00Z"))).toBe("2026-11-06");
  });

  it("KST 자정 직전은 그날 날짜를 반환한다", () => {
    expect(formatKstDate(new Date("2026-11-06T14:59:59Z"))).toBe("2026-11-06");
  });
});
