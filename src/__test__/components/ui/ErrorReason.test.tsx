import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorReason } from "@/components/ui/ErrorReason";

const message = "AccessDenied: cloudwatch:GetMetricStatistics 권한이 없습니다.";

describe("ErrorReason", () => {
  it("오류 원인 라벨과 message를 원문 그대로 표시한다", () => {
    render(<ErrorReason message={message} />);

    expect(screen.getByText("오류 원인")).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("guide를 주면 안내 문구를 표시한다", () => {
    render(
      <ErrorReason message={message} guide="IAM Role 권한을 확인해 주세요." />,
    );

    expect(
      screen.getByText("IAM Role 권한을 확인해 주세요."),
    ).toBeInTheDocument();
  });

  it("guide가 없으면 안내 문단을 그리지 않는다", () => {
    const { container } = render(<ErrorReason message={message} />);

    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  it("action 버튼을 누르면 onClick이 호출된다", () => {
    const onClick = vi.fn();
    render(
      <ErrorReason
        message={message}
        action={{ label: "다시 시도", onClick }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("action.loading이면 버튼이 비활성이고 aria-busy이며 눌러도 onClick이 호출되지 않는다", () => {
    const onClick = vi.fn();
    render(
      <ErrorReason
        message={message}
        action={{ label: "다시 시도", onClick, loading: true }}
      />,
    );
    const button = screen.getByRole("button", { name: "다시 시도" });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(onClick).not.toHaveBeenCalled();
  });
});
