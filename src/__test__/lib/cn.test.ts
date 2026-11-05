import { cn } from "@/lib/cn";
import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("조건부 클래스를 합치고 충돌하는 Tailwind 클래스는 뒤의 것을 남긴다", () => {
    expect(cn("p-2", false && "hidden", "p-4")).toBe("p-4");
  });

  it("글자 크기 토큰과 글자 색 토큰은 서로 지우지 않는다", () => {
    expect(cn("text-title-large", "text-text-strong")).toBe(
      "text-title-large text-text-strong",
    );
  });

  it("같은 종류의 디자인 토큰끼리는 뒤의 것을 남긴다", () => {
    expect(cn("text-title-large", "text-body-medium")).toBe("text-body-medium");
    expect(cn("p-padding-small", "p-padding-large")).toBe("p-padding-large");
    expect(cn("gap-gap-small", "gap-gap-large")).toBe("gap-gap-large");
    expect(cn("mt-spacing-small", "mt-spacing-large")).toBe("mt-spacing-large");
    expect(cn("px-margin-screen", "px-margin-section")).toBe(
      "px-margin-section",
    );
    expect(cn("rounded-medium", "rounded-large")).toBe("rounded-large");
    expect(cn("shadow-weak", "shadow-strong")).toBe("shadow-strong");
  });
});
