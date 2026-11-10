import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingState } from "@/components/ui/LoadingState";

describe("LoadingState", () => {
  it("status 안에 스크린리더용 title과 움직이는 점 3개를 보여 준다", () => {
    render(<LoadingState title="불러오는 중" />);
    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("불러오는 중");
    expect(status.querySelectorAll(".animate-dot-pulse")).toHaveLength(3);
  });
});
