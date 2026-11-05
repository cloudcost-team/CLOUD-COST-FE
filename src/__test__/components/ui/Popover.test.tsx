import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Popover } from "@/components/ui/Popover";

function Controlled({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <Popover
        open={open}
        onOpenChange={setOpen}
        title="기간 선택"
        helper="KST 기준입니다."
        actions={<button type="button">적용</button>}
        trigger={({ ref, ...props }) => (
          <button type="button" ref={ref} {...props}>
            기간
          </button>
        )}
      >
        <button type="button">패널 안쪽</button>
      </Popover>
      <button type="button">바깥</button>
    </div>
  );
}

describe("Popover", () => {
  it("트리거를 누르면 aria-expanded가 true가 되고 dialog가 열려 패널에 포커스한다", () => {
    render(<Controlled />);
    const trigger = screen.getByRole("button", { name: "기간" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "기간 선택" })).toHaveFocus();
  });

  it("Escape를 누르면 닫히고 트리거로 포커스가 돌아간다", () => {
    render(<Controlled initialOpen />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "기간" })).toHaveFocus();
  });

  it("바깥을 pointerDown하면 닫힌다", () => {
    render(<Controlled initialOpen />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "바깥" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("패널 안을 pointerDown하면 열린 채로 유지된다", () => {
    render(<Controlled initialOpen />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "패널 안쪽" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("helper와 actions를 표시한다", () => {
    render(<Controlled initialOpen />);

    expect(screen.getByText("KST 기준입니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "적용" })).toBeInTheDocument();
  });
});
