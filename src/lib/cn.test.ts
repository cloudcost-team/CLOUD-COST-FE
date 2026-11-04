import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("조건부 클래스를 합치고 충돌하는 Tailwind 클래스는 뒤의 것을 남긴다", () => {
    expect(cn("p-2", false && "hidden", "p-4")).toBe("p-4");
  });
});
