import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "@/components/ui/Modal";

function renderModal(props: { open: boolean; onClose?: () => void }) {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose ?? vi.fn()}
      title="계정 연결 해제"
      description="연결을 해제해도 AWS 계정은 바뀌지 않습니다."
    >
      <button type="button">안쪽 내용</button>
    </Modal>
  );
}

describe("Modal", () => {
  it("open이면 dialog가 열리고 제목을 이름, 설명을 접근성 설명으로 가진다", () => {
    render(renderModal({ open: true }));

    const dialog = screen.getByRole("dialog", { name: "계정 연결 해제" });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleDescription(
      "연결을 해제해도 AWS 계정은 바뀌지 않습니다.",
    );
  });

  it("open이 false이면 dialog가 열려 있지 않다", () => {
    const { container } = render(renderModal({ open: false }));

    expect(container.querySelector("dialog")).not.toHaveAttribute("open");
  });

  it("dialog에 cancel 이벤트가 오면 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(renderModal({ open: true, onClose }));

    const dialog = screen.getByRole("dialog");
    fireEvent(dialog, new Event("cancel", { cancelable: true }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("dialog 요소 자체(배경)를 클릭하면 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(renderModal({ open: true, onClose }));

    fireEvent.click(screen.getByRole("dialog"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("안쪽 내용을 클릭하면 onClose를 호출하지 않는다", () => {
    const onClose = vi.fn();
    render(renderModal({ open: true, onClose }));

    fireEvent.click(screen.getByRole("button", { name: "안쪽 내용" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("open이 true에서 false로 바뀌면 dialog가 닫힌다", () => {
    const { container, rerender } = render(renderModal({ open: true }));

    rerender(renderModal({ open: false }));

    expect(container.querySelector("dialog")).not.toHaveAttribute("open");
  });
});
