import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useDismiss } from "@/hooks/useDismiss";

function Harness({
  open,
  onDismiss,
}: {
  open: boolean;
  onDismiss: (reason: "escape" | "outside") => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, onDismiss);
  return (
    <div>
      <div ref={ref}>
        <button type="button">안쪽</button>
      </div>
      <button type="button">바깥</button>
    </div>
  );
}

function LayeredHarness({
  onOuterDismiss,
  onInnerDismiss,
}: {
  onOuterDismiss: (reason: "escape" | "outside") => void;
  onInnerDismiss: (reason: "escape" | "outside") => void;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useDismiss(outerRef, true, onOuterDismiss);
  useDismiss(innerRef, true, onInnerDismiss);
  return (
    <div ref={outerRef}>
      <div ref={innerRef}>안쪽 레이어</div>
    </div>
  );
}

describe("useDismiss", () => {
  it("열려 있을 때 Escape를 누르면 escape 사유로 호출한다", () => {
    const onDismiss = vi.fn();
    render(<Harness open onDismiss={onDismiss} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onDismiss).toHaveBeenCalledExactlyOnceWith("escape");
  });

  it("열려 있을 때 바깥을 pointerdown하면 outside 사유로 호출한다", () => {
    const onDismiss = vi.fn();
    render(<Harness open onDismiss={onDismiss} />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "바깥" }));

    expect(onDismiss).toHaveBeenCalledExactlyOnceWith("outside");
  });

  it("안쪽을 pointerdown하면 호출하지 않는다", () => {
    const onDismiss = vi.fn();
    render(<Harness open onDismiss={onDismiss} />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "안쪽" }));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("Escape 외의 키는 무시한다", () => {
    const onDismiss = vi.fn();
    render(<Harness open onDismiss={onDismiss} />);

    fireEvent.keyDown(document, { key: "Enter" });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("닫혀 있으면 Escape와 바깥 pointerdown 모두 호출하지 않는다", () => {
    const onDismiss = vi.fn();
    render(<Harness open={false} onDismiss={onDismiss} />);

    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.pointerDown(screen.getByRole("button", { name: "바깥" }));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("레이어가 중첩되면 Escape는 가장 위 레이어만 닫고 기본 동작을 막는다", () => {
    const onOuterDismiss = vi.fn();
    const onInnerDismiss = vi.fn();
    render(
      <LayeredHarness
        onOuterDismiss={onOuterDismiss}
        onInnerDismiss={onInnerDismiss}
      />,
    );
    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event);

    expect(onInnerDismiss).toHaveBeenCalledExactlyOnceWith("escape");
    expect(onOuterDismiss).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });
});
