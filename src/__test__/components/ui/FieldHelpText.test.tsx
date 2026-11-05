import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  FieldHelpText,
  type FieldHelpTextTone,
} from "@/components/ui/FieldHelpText";

describe("FieldHelpText", () => {
  it.each<[FieldHelpTextTone, string]>([
    ["default", "text-text-tertiary"],
    ["error", "text-text-danger"],
    ["success", "text-text-success"],
  ])("%s 톤은 글자색 %s이고 아이콘이 있다", (tone, textClass) => {
    const { container } = render(
      <FieldHelpText tone={tone}>안내 문구</FieldHelpText>,
    );

    expect(screen.getByText("안내 문구").closest("p")).toHaveClass(textClass);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("showIcon이 false면 아이콘이 없다", () => {
    const { container } = render(
      <FieldHelpText showIcon={false}>안내 문구</FieldHelpText>,
    );

    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("loading 톤은 아이콘 대신 회전하는 스피너를 보여 주고 글자색이 text-tertiary다", () => {
    const { container } = render(
      <FieldHelpText tone="loading">확인 중</FieldHelpText>,
    );

    expect(screen.getByText("확인 중").closest("p")).toHaveClass(
      "text-text-tertiary",
    );
    expect(container.querySelector("svg")).toHaveClass("animate-spin");
    expect(container.querySelector("svg path")).not.toBeInTheDocument();
  });
});
