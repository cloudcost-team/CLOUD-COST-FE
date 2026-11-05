import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("status 안에 title과 description, 회전하는 스피너를 보여 준다", () => {
    render(
      <LoadingState title="불러오는 중" description="잠시만 기다려 주세요." />,
    );
    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("불러오는 중");
    expect(status).toHaveTextContent("잠시만 기다려 주세요.");
    expect(status.querySelector("svg")).toHaveClass("animate-spin");
  });
});
