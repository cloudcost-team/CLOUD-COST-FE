import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("아니오를 누르면 onClose를 호출한다", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="삭제"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "아니오" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("예를 누르면 onConfirm을 호출한다", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="삭제"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "예" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("가로 배치에서 열리면 아니오에 포커스한다", () => {
    render(<ConfirmDialog open onClose={vi.fn()} title="삭제" />);

    expect(screen.getByRole("button", { name: "아니오" })).toHaveFocus();
  });

  it("세로 배치에서 열리면 아니오에 포커스한다", () => {
    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        title="삭제"
        direction="vertical"
      />,
    );

    expect(screen.getByRole("button", { name: "아니오" })).toHaveFocus();
  });

  it("tone이 danger이면 예 버튼이 위험 배경을 가진다", () => {
    render(<ConfirmDialog open onClose={vi.fn()} title="삭제" tone="danger" />);

    expect(screen.getByRole("button", { name: "예" })).toHaveClass(
      "bg-fill-danger",
    );
  });

  it("confirmLoading이면 예 버튼이 비활성이고 aria-busy다", () => {
    render(
      <ConfirmDialog open onClose={vi.fn()} title="삭제" confirmLoading />,
    );

    const button = screen.getByRole("button", { name: "예" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("confirmLoading이면 예를 클릭해도 onConfirm을 호출하지 않는다", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="삭제"
        confirmLoading
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "예" }));

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("alert형은 확인 버튼만 보이고 아니오 버튼이 없다", () => {
    render(<ConfirmDialog open onClose={vi.fn()} title="알림" kind="alert" />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "아니오" })).toBeNull();
  });

  it("alert형에서 onConfirm이 없으면 확인 클릭 시 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(<ConfirmDialog open onClose={onClose} title="알림" kind="alert" />);

    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("alert형도 confirmLoading이면 확인 버튼이 비활성이고 aria-busy다", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="처리 중"
        kind="alert"
        confirmLoading
      />,
    );

    const button = screen.getByRole("button", { name: "확인" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    fireEvent.click(button);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
