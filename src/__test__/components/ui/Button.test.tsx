import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/Button";

describe("Button", () => {
  it("누르면 onClick이 호출된다", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>저장</Button>);

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("type을 넘기지 않으면 button이다", () => {
    render(<Button>저장</Button>);

    expect(screen.getByRole("button", { name: "저장" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("type=submit을 넘기면 그대로 유지한다", () => {
    render(<Button type="submit">저장</Button>);

    expect(screen.getByRole("button", { name: "저장" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  describe("disabled", () => {
    it("눌러도 onClick이 호출되지 않는다", () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          저장
        </Button>,
      );

      fireEvent.click(screen.getByRole("button", { name: "저장" }));

      expect(onClick).not.toHaveBeenCalled();
    });

    it.each<ButtonVariant>(["primary", "secondary", "assistive", "danger"])(
      "%s 변형이어도 회색 면과 회색 글자로 보인다",
      (variant) => {
        render(
          <Button disabled variant={variant}>
            저장
          </Button>,
        );

        const button = screen.getByRole("button", { name: "저장" });
        expect(button).toHaveClass(
          "bg-fill-neutral-weak",
          "text-text-quaternary",
        );
      },
    );

    it.each([
      ["primary", "bg-fill-brand"],
      ["secondary", "bg-fill-brand-weak"],
      ["danger", "bg-fill-danger"],
    ] as const)("%s 변형 색(%s)을 쓰지 않는다", (variant, variantColor) => {
      render(
        <Button disabled variant={variant}>
          저장
        </Button>,
      );

      expect(screen.getByRole("button", { name: "저장" })).not.toHaveClass(
        variantColor,
      );
    });
  });

  describe("loading", () => {
    it("눌러도 onClick이 호출되지 않는다", () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          저장
        </Button>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(onClick).not.toHaveBeenCalled();
    });

    it("aria-busy가 true다", () => {
      render(<Button loading>저장</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("로딩이 아니면 aria-busy가 없다", () => {
      render(<Button>저장</Button>);

      expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
    });

    it("글자는 DOM에 남기고 감싼 span을 invisible로 숨겨 자리를 유지한다", () => {
      render(<Button loading>저장</Button>);

      expect(screen.getByText("저장")).toHaveClass("invisible");
    });

    it("로딩이 아니면 글자가 invisible이 아니다", () => {
      render(<Button>저장</Button>);

      expect(screen.getByText("저장")).not.toHaveClass("invisible");
    });

    it("변형 색을 유지하고 회색으로 바뀌지 않는다", () => {
      render(
        <Button loading variant="primary">
          저장
        </Button>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-fill-brand");
      expect(button).not.toHaveClass("bg-fill-neutral-weak");
    });
  });

  it("disabled와 loading이 같이 오면 로딩 모양(변형 색, aria-busy)을 우선한다", () => {
    render(
      <Button disabled loading variant="primary">
        저장
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-fill-brand");
    expect(button).not.toHaveClass("bg-fill-neutral-weak");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  describe("icon", () => {
    it("icon을 주면 글자 뒤에 svg가 나온다", () => {
      const { container } = render(<Button icon="external-link">열기</Button>);

      const content = screen.getByText("열기");
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(content.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(content.childNodes[1]).toBe(svg);
    });

    it("icon이 없으면 svg가 없다", () => {
      const { container } = render(<Button>열기</Button>);

      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  it.each([
    ["primary", "bg-fill-brand", "text-text-on-fill"],
    ["secondary", "bg-fill-brand-weak", "text-text-brand"],
    ["assistive", "bg-fill-neutral-weak", "text-text-secondary"],
    ["danger", "bg-fill-danger", "text-text-on-fill"],
  ] as const)(
    "%s 변형은 면 %s, 글자 %s 색이다",
    (variant, fillClass, textClass) => {
      render(<Button variant={variant}>저장</Button>);

      expect(screen.getByRole("button")).toHaveClass(fillClass, textClass);
    },
  );

  describe("크기", () => {
    it.each<[ButtonSize, string]>([
      ["large", "h-12"],
      ["medium", "h-10"],
      ["small", "h-8"],
    ])("%s 크기는 높이 클래스 %s다", (size, heightClass) => {
      render(<Button size={size}>저장</Button>);

      expect(screen.getByRole("button")).toHaveClass(heightClass);
    });

    it("small일 때만 아이콘 너비가 16이다", () => {
      const { container } = render(
        <Button size="small" icon="external-link">
          열기
        </Button>,
      );

      expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    });

    it.each<ButtonSize>(["large", "medium"])(
      "%s일 때 아이콘 너비는 20이다",
      (size) => {
        const { container } = render(
          <Button size={size} icon="external-link">
            열기
          </Button>,
        );

        expect(container.querySelector("svg")).toHaveAttribute("width", "20");
      },
    );
  });
});
