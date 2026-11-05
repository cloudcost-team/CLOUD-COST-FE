import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

type Section = "usage" | "cost" | "alert";

const items: { value: Section; label: string; content: string }[] = [
  { value: "usage", label: "사용량", content: "사용량 내용" },
  { value: "cost", label: "추정 비용", content: "비용 내용" },
  { value: "alert", label: "알림", content: "알림 내용" },
];

function Controlled({
  initial = "usage",
  onChange,
}: {
  initial?: Section;
  onChange?: (value: Section) => void;
}) {
  const [value, setValue] = useState<Section>(initial);
  return (
    <Tabs
      aria-label="분석"
      items={items}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe("Tabs", () => {
  it("선택된 탭만 aria-selected가 true다", () => {
    render(<Controlled initial="cost" />);

    expect(screen.getByRole("tab", { name: "사용량" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "추정 비용" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "알림" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("선택된 탭의 content만 보인다", () => {
    render(<Controlled initial="cost" />);

    expect(screen.getByText("비용 내용")).toBeInTheDocument();
    expect(screen.queryByText("사용량 내용")).not.toBeInTheDocument();
    expect(screen.queryByText("알림 내용")).not.toBeInTheDocument();
  });

  it("tabpanel의 aria-labelledby는 선택된 탭 id다", () => {
    render(<Controlled initial="cost" />);

    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      screen.getByRole("tab", { name: "추정 비용" }).id,
    );
  });

  it("탭의 aria-controls는 tabpanel id다", () => {
    render(<Controlled />);

    const panelId = screen.getByRole("tabpanel").id;
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveAttribute("aria-controls", panelId);
    }
  });

  it("다른 탭을 누르면 그 값으로 onChange가 호출된다", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    fireEvent.click(screen.getByRole("tab", { name: "알림" }));

    expect(onChange).toHaveBeenCalledWith("alert");
  });

  it("ArrowRight로 다음 탭을 선택한다", () => {
    render(<Controlled />);

    fireEvent.keyDown(screen.getByRole("tab", { name: "사용량" }), {
      key: "ArrowRight",
    });

    expect(screen.getByRole("tab", { name: "추정 비용" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("Home으로 첫 탭을 선택한다", () => {
    render(<Controlled initial="alert" />);

    fireEvent.keyDown(screen.getByRole("tab", { name: "알림" }), {
      key: "Home",
    });

    expect(screen.getByRole("tab", { name: "사용량" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("End로 마지막 탭을 선택한다", () => {
    render(<Controlled />);

    fireEvent.keyDown(screen.getByRole("tab", { name: "사용량" }), {
      key: "End",
    });

    expect(screen.getByRole("tab", { name: "알림" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
