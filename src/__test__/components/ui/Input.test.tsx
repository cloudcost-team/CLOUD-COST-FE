import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("라벨로 input을 찾을 수 있고 입력하면 onChange가 호출된다", () => {
    const onChange = vi.fn();
    render(<Input label="계정 이름" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("계정 이름"), {
      target: { value: "prod" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  describe("error", () => {
    it("aria-invalid가 true다", () => {
      render(<Input label="계정 이름" error="필수 항목입니다" />);

      expect(screen.getByLabelText("계정 이름")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("오류 문구를 보여 주고 input의 설명으로 연결한다", () => {
      render(<Input label="계정 이름" error="필수 항목입니다" />);

      expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
      expect(screen.getByLabelText("계정 이름")).toHaveAccessibleDescription(
        "필수 항목입니다",
      );
    });

    it("오류가 없으면 aria-invalid가 없다", () => {
      render(<Input label="계정 이름" />);

      expect(screen.getByLabelText("계정 이름")).not.toHaveAttribute(
        "aria-invalid",
      );
    });
  });

  it("오류가 없으면 helperText를 기본 톤으로 보여 준다", () => {
    render(<Input label="계정 이름" helperText="영문으로 입력하세요" />);

    expect(screen.getByText("영문으로 입력하세요").closest("p")).toHaveClass(
      "text-text-tertiary",
    );
  });

  it("prefix는 input 앞, suffix는 input 뒤에 있다", () => {
    render(<Input label="금액" prefix="₩" suffix="원" />);

    const input = screen.getByLabelText("금액");
    const prefix = screen.getByText("₩");
    const suffix = screen.getByText("원");

    expect(
      prefix.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      input.compareDocumentPosition(suffix) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("showCounter와 maxLength가 있으면 현재/최대 글자 수를 보여 준다", () => {
    render(
      <Input
        label="계정 이름"
        value="abc"
        maxLength={10}
        showCounter
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("비제어 입력은 defaultValue와 사용자 입력을 글자 수에 반영한다", () => {
    render(
      <Input label="계정 이름" defaultValue="abc" maxLength={10} showCounter />,
    );
    const input = screen.getByLabelText("계정 이름");

    expect(screen.getByText("3/10")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "hello" } });

    expect(screen.getByText("5/10")).toBeInTheDocument();
  });

  describe("onClear", () => {
    it("값이 있으면 지우기 버튼을 누를 때 onClear가 호출된다", () => {
      const onClear = vi.fn();
      render(
        <Input
          label="계정 이름"
          value="abc"
          onChange={() => {}}
          onClear={onClear}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "입력값 지우기" }));

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("값이 비었으면 지우기 버튼이 없다", () => {
      render(
        <Input
          label="계정 이름"
          value=""
          onChange={() => {}}
          onClear={() => {}}
        />,
      );

      expect(
        screen.queryByRole("button", { name: "입력값 지우기" }),
      ).not.toBeInTheDocument();
    });

    it("disabled면 지우기 버튼이 없다", () => {
      render(
        <Input
          label="계정 이름"
          value="abc"
          disabled
          onChange={() => {}}
          onClear={() => {}}
        />,
      );

      expect(
        screen.queryByRole("button", { name: "입력값 지우기" }),
      ).not.toBeInTheDocument();
    });

    it("비제어 입력을 지우면 값과 카운터를 비우고 input에 포커스한다", () => {
      const onClear = vi.fn();
      render(
        <Input
          label="계정 이름"
          defaultValue="abc"
          maxLength={10}
          showCounter
          onClear={onClear}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "입력값 지우기" }));

      expect(screen.getByLabelText("계정 이름")).toHaveValue("");
      expect(screen.getByLabelText("계정 이름")).toHaveFocus();
      expect(screen.getByText("0/10")).toBeInTheDocument();
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });

  it("required면 input도 required다", () => {
    render(<Input label="계정 이름" required />);

    expect(screen.getByLabelText("계정 이름")).toBeRequired();
  });

  it("disabled면 input도 disabled다", () => {
    render(<Input label="계정 이름" disabled />);

    expect(screen.getByLabelText("계정 이름")).toBeDisabled();
  });
});
