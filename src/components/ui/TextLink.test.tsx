import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextLink } from "./TextLink";

const FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;

describe("TextLink", () => {
  it("href가 링크 주소이고 children이 링크 이름이다", () => {
    render(<TextLink href="/accounts">계정 보기</TextLink>);

    expect(screen.getByRole("link", { name: "계정 보기" })).toHaveAttribute(
      "href",
      "/accounts",
    );
  });

  it("기본 아이콘은 글자 오른쪽에 나온다", () => {
    const { container } = render(<TextLink href="/a">자세히</TextLink>);

    const label = screen.getByText("자세히");
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(label.compareDocumentPosition(svg!) & FOLLOWING).toBeTruthy();
  });

  it("icon이 null이면 svg가 없다", () => {
    const { container } = render(
      <TextLink href="/a" icon={null}>
        자세히
      </TextLink>,
    );

    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  describe('iconPosition="left"', () => {
    it("아이콘이 글자 앞에 나온다", () => {
      const { container } = render(
        <TextLink href="/a" iconPosition="left">
          돌아가기
        </TextLink>,
      );

      const label = screen.getByText("돌아가기");
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg!.compareDocumentPosition(label) & FOLLOWING).toBeTruthy();
    });

    it("아이콘을 좌우로 뒤집는다", () => {
      const { container } = render(
        <TextLink href="/a" iconPosition="left">
          돌아가기
        </TextLink>,
      );

      expect(container.querySelector("svg")).toHaveClass("-scale-x-100");
    });
  });

  it("오른쪽 아이콘은 뒤집지 않는다", () => {
    const { container } = render(<TextLink href="/a">자세히</TextLink>);

    expect(container.querySelector("svg")).not.toHaveClass("-scale-x-100");
  });

  it('tone="neutral"이면 text-text-secondary 색이다', () => {
    render(
      <TextLink href="/a" tone="neutral">
        자세히
      </TextLink>,
    );

    expect(screen.getByRole("link")).toHaveClass("text-text-secondary");
  });
});
