import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";
import { iconPaths } from "./iconPaths";

describe("Checkbox", () => {
  it("라벨을 누르면 체크가 토글되고 onChange가 호출된다", () => {
    const onChange = vi.fn();
    render(<Checkbox label="약관 동의" onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "약관 동의" });

    fireEvent.click(screen.getByText("약관 동의"));

    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  describe("indeterminate", () => {
    it("input의 indeterminate가 true다", () => {
      render(<Checkbox label="전체 선택" indeterminate />);

      expect(
        (screen.getByRole("checkbox") as HTMLInputElement).indeterminate,
      ).toBe(true);
    });

    it("minus 아이콘을 보여 준다", () => {
      const { container } = render(
        <Checkbox label="전체 선택" indeterminate />,
      );

      expect(container.querySelector("svg path")).toHaveAttribute(
        "d",
        iconPaths.minus[0].d,
      );
    });

    it("아니면 check 아이콘을 보여 준다", () => {
      const { container } = render(<Checkbox label="전체 선택" />);

      expect(container.querySelector("svg path")).toHaveAttribute(
        "d",
        iconPaths.check[0].d,
      );
    });
  });

  it("disabled면 눌러도 체크가 바뀌지 않는다", () => {
    render(<Checkbox label="약관 동의" disabled />);
    const checkbox = screen.getByRole("checkbox", { name: "약관 동의" });

    fireEvent.click(screen.getByText("약관 동의"));

    expect(checkbox).not.toBeChecked();
  });

  it("label 없이 aria-label만 줘도 이름으로 찾을 수 있다", () => {
    render(<Checkbox aria-label="행 선택" />);

    expect(
      screen.getByRole("checkbox", { name: "행 선택" }),
    ).toBeInTheDocument();
  });
});
