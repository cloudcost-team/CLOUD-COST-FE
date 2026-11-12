import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

describe("Badge", () => {
  it("children 글자를 표시하고 tone이 없으면 neutral 색을 쓴다", () => {
    render(<Badge>유휴</Badge>);

    const badge = screen.getByText("유휴");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-fill-neutral-weak", "text-text-secondary");
  });

  it.each<[BadgeTone, string, string]>([
    ["neutral", "bg-fill-neutral-weak", "text-text-secondary"],
    ["brand", "bg-fill-brand-weak", "text-text-brand"],
    ["info", "bg-fill-sky-weak", "text-text-primary"],
    ["success", "bg-fill-mint-weak", "text-text-success"],
    ["warning", "bg-fill-warning-weak", "text-text-warning"],
    ["danger", "bg-fill-danger-weak", "text-text-danger"],
  ])("%s 톤은 배경 %s, 글자색 %s이다", (tone, bgClass, textClass) => {
    render(<Badge tone={tone}>상태</Badge>);

    expect(screen.getByText("상태")).toHaveClass(bgClass, textClass);
  });
});
