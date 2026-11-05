import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "@/components/ui/IconButton";

describe("IconButton", () => {
  it("aria-label이 버튼의 접근 이름이 된다", () => {
    render(<IconButton icon="close" aria-label="닫기" />);

    expect(screen.getByRole("button", { name: "닫기" })).toBeInTheDocument();
  });

  it("누르면 onClick이 호출된다", () => {
    const onClick = vi.fn();
    render(<IconButton icon="close" aria-label="닫기" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe("disabled", () => {
    it("눌러도 onClick이 호출되지 않는다", () => {
      const onClick = vi.fn();
      render(
        <IconButton
          icon="close"
          aria-label="닫기"
          disabled
          onClick={onClick}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "닫기" }));

      expect(onClick).not.toHaveBeenCalled();
    });

    it("아이콘이 text-icon-tertiary 색이다", () => {
      const { container } = render(
        <IconButton icon="close" aria-label="닫기" disabled />,
      );

      expect(container.querySelector("svg")).toHaveClass("text-icon-tertiary");
    });
  });

  describe("variant", () => {
    it("weak면 연한 회색 면이 있다", () => {
      render(<IconButton icon="close" aria-label="닫기" variant="weak" />);

      expect(screen.getByRole("button")).toHaveClass("bg-fill-neutral-weak");
    });

    it("ghost(기본)는 면이 없다", () => {
      render(<IconButton icon="close" aria-label="닫기" />);

      expect(screen.getByRole("button")).not.toHaveClass(
        "bg-fill-neutral-weak",
      );
    });
  });

  describe("size", () => {
    it("small(기본)은 size-8이다", () => {
      render(<IconButton icon="close" aria-label="닫기" />);

      expect(screen.getByRole("button")).toHaveClass("size-8");
    });

    it("medium은 size-10이다", () => {
      render(<IconButton icon="close" aria-label="닫기" size="medium" />);

      expect(screen.getByRole("button")).toHaveClass("size-10");
    });
  });
});
