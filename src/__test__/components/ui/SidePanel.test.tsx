import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SidePanel } from "@/components/ui/SidePanel";

describe("SidePanel", () => {
  it("제목을 dialog 이름으로 갖고 badge, children, footer를 표시한다", () => {
    render(
      <SidePanel
        open
        onClose={vi.fn()}
        title="인스턴스 상세"
        badge={<span>실행 중</span>}
        footer={<button type="button">저장</button>}
      >
        <p>본문 내용</p>
      </SidePanel>,
    );

    expect(
      screen.getByRole("dialog", { name: "인스턴스 상세" }),
    ).toBeInTheDocument();
    expect(screen.getByText("실행 중")).toBeInTheDocument();
    expect(screen.getByText("본문 내용")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("닫기 버튼을 누르면 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(
      <SidePanel open onClose={onClose} title="인스턴스 상세">
        <p>본문</p>
      </SidePanel>,
    );

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("footer가 없으면 푸터 영역을 렌더하지 않는다", () => {
    render(
      <SidePanel open onClose={vi.fn()} title="인스턴스 상세">
        <p>본문</p>
      </SidePanel>,
    );

    expect(screen.getByRole("dialog").querySelector(".border-t")).toBeNull();
  });
});
