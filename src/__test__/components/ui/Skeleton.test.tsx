import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton, type SkeletonShape } from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it.each<[SkeletonShape, string[]]>([
    ["text", ["h-3.5", "w-50", "rounded-xsmall"]],
    ["title", ["h-6", "w-35", "rounded-small"]],
    ["block", ["h-30", "w-80", "rounded-large"]],
    ["circle", ["size-10", "rounded-full"]],
  ])(
    "%s 모양은 %j 클래스를 갖고 스크린 리더에서 숨겨진다",
    (shape, classes) => {
      const { container } = render(<Skeleton shape={shape} />);
      const skeleton = container.firstElementChild;

      expect(skeleton).toHaveClass(...classes);
      expect(skeleton).toHaveAttribute("aria-hidden", "true");
    },
  );

  it("className으로 크기를 덮어쓰면 기본 크기 클래스가 빠진다", () => {
    const { container } = render(
      <Skeleton shape="block" className="h-40 w-full" />,
    );
    const skeleton = container.firstElementChild;

    expect(skeleton).toHaveClass("h-40", "w-full");
    expect(skeleton).not.toHaveClass("h-30");
    expect(skeleton).not.toHaveClass("w-80");
  });
});
