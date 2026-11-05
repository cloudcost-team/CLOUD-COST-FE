import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("title을 주면 제목 heading이 있고 같은 이름의 카드 구역이 찾힌다", () => {
    render(<Card title="EC2 비용">본문</Card>);

    expect(
      screen.getByRole("heading", { name: "EC2 비용" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "EC2 비용" }),
    ).toBeInTheDocument();
  });

  it("meta와 action이 표시된다", () => {
    render(
      <Card title="EC2 비용" meta="최근 7일" action={<button>상세</button>}>
        본문
      </Card>,
    );

    expect(screen.getByText("최근 7일")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "상세" })).toBeInTheDocument();
  });

  it("title, meta, action이 모두 없으면 heading 없이 children만 표시한다", () => {
    render(<Card>본문만</Card>);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("본문만")).toBeInTheDocument();
  });
});
