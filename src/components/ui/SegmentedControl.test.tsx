import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

type Period = "day" | "week" | "month";

const options: { value: Period; label: string }[] = [
  { value: "day", label: "일" },
  { value: "week", label: "주" },
  { value: "month", label: "월" },
];

function Controlled({
  initial = "day",
  onChange,
}: {
  initial?: Period;
  onChange?: (value: Period) => void;
}) {
  const [value, setValue] = useState<Period>(initial);
  return (
    <SegmentedControl
      aria-label="기간"
      options={options}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe("SegmentedControl", () => {
  it("radiogroup 이름은 aria-label이다", () => {
    render(<Controlled />);

    expect(
      screen.getByRole("radiogroup", { name: "기간" }),
    ).toBeInTheDocument();
  });

  it("선택된 칸만 aria-checked가 true다", () => {
    render(<Controlled initial="week" />);

    expect(screen.getByRole("radio", { name: "일" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "주" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "월" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("tabIndex 0은 선택된 칸 하나뿐이다", () => {
    render(<Controlled initial="week" />);

    expect(screen.getByRole("radio", { name: "일" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("radio", { name: "주" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("radio", { name: "월" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("다른 칸을 누르면 그 값으로 onChange가 호출된다", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "월" }));

    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("ArrowRight로 다음 칸을 선택한다", () => {
    render(<Controlled />);

    fireEvent.keyDown(screen.getByRole("radio", { name: "일" }), {
      key: "ArrowRight",
    });

    expect(screen.getByRole("radio", { name: "주" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("ArrowLeft로 이전 칸을 선택한다", () => {
    render(<Controlled initial="week" />);

    fireEvent.keyDown(screen.getByRole("radio", { name: "주" }), {
      key: "ArrowLeft",
    });

    expect(screen.getByRole("radio", { name: "일" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("마지막 칸에서 ArrowRight를 누르면 처음 칸으로 순환한다", () => {
    render(<Controlled initial="month" />);

    fireEvent.keyDown(screen.getByRole("radio", { name: "월" }), {
      key: "ArrowRight",
    });

    expect(screen.getByRole("radio", { name: "일" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("첫 칸에서 ArrowLeft를 누르면 마지막 칸으로 순환한다", () => {
    render(<Controlled />);

    fireEvent.keyDown(screen.getByRole("radio", { name: "일" }), {
      key: "ArrowLeft",
    });

    expect(screen.getByRole("radio", { name: "월" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
