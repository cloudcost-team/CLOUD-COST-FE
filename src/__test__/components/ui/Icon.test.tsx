import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "@/components/ui/Icon";

describe("Icon", () => {
  it("name에 맞는 개수의 path를 그린다 (grid는 4개)", () => {
    const { container } = render(<Icon name="grid" />);

    expect(container.querySelectorAll("svg path")).toHaveLength(4);
  });

  it("currentColor 선으로 그려 부모 글자색을 따르고 스크린 리더에서 숨긴다", () => {
    const { container } = render(<Icon name="grid" />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("size를 주지 않으면 20이다", () => {
    const { container } = render(<Icon name="grid" />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
  });

  it("size=16이면 width·height가 16이고 viewBox는 0 0 20 20을 유지한다", () => {
    const { container } = render(<Icon name="grid" size={16} />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
    expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
  });
});
