import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "@/components/ui/EmptyState";
import { iconPaths } from "@/components/ui/iconPaths";

describe("EmptyState", () => {
  it("title과 description을 표시하고 기본 아이콘은 file-text다", () => {
    const { container } = render(
      <EmptyState
        title="데이터가 없어요"
        description="계정을 연결해 주세요."
      />,
    );

    expect(screen.getByText("데이터가 없어요")).toBeInTheDocument();
    expect(screen.getByText("계정을 연결해 주세요.")).toBeInTheDocument();
    expect(container.querySelector("svg path")).toHaveAttribute(
      "d",
      iconPaths["file-text"][0].d,
    );
  });

  it("icon을 주면 해당 아이콘을 보여 준다", () => {
    const { container } = render(
      <EmptyState title="비어 있음" icon="bar-chart" />,
    );

    expect(container.querySelector("svg path")).toHaveAttribute(
      "d",
      iconPaths["bar-chart"][0].d,
    );
  });

  it("action 버튼을 누르면 onClick이 호출된다", () => {
    const onClick = vi.fn();
    render(
      <EmptyState title="비어 있음" action={{ label: "연결하기", onClick }} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "연결하기" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("action이 없으면 버튼이 없다", () => {
    render(<EmptyState title="비어 있음" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
