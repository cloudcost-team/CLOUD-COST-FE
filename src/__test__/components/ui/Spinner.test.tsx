import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "@/components/ui/Spinner";

describe("Spinner", () => {
  it("size가 없으면 medium(size-6)이고 회전하며 스크린 리더에서 숨겨진다", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveClass("size-6", "animate-spin");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("large면 size-10이다", () => {
    const { container } = render(<Spinner size="large" />);

    expect(container.querySelector("svg")).toHaveClass("size-10");
  });
});
