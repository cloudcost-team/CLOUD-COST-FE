import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Banner, type BannerTone } from "@/components/ui/Banner";
import { iconPaths, type IconName } from "@/components/ui/iconPaths";

describe("Banner", () => {
  it("title과 description을 표시한다", () => {
    render(<Banner title="연결 실패" description="권한을 확인해 주세요." />);

    expect(screen.getByText("연결 실패")).toBeInTheDocument();
    expect(screen.getByText("권한을 확인해 주세요.")).toBeInTheDocument();
  });

  it("description이 없으면 설명 문단을 그리지 않는다", () => {
    const { container } = render(<Banner title="연결 실패" />);

    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it.each<[BannerTone, string]>([
    ["danger", "alert"],
    ["warning", "status"],
    ["info", "status"],
  ])("%s 톤은 role이 %s다", (tone, role) => {
    render(<Banner tone={tone} title="알림" />);

    expect(screen.getByRole(role)).toBeInTheDocument();
  });

  it.each<[BannerTone, string, IconName]>([
    ["danger", "bg-fill-danger-weak", "alert-circle"],
    ["warning", "bg-fill-warning-weak", "alert-triangle"],
    ["info", "bg-fill-brand-weak", "info"],
  ])("%s 톤은 배경 %s와 %s 아이콘을 쓴다", (tone, bgClass, iconName) => {
    const { container } = render(<Banner tone={tone} title="알림" />);

    expect(
      screen.getByRole(tone === "danger" ? "alert" : "status"),
    ).toHaveClass(bgClass);
    expect(container.querySelector("svg path")).toHaveAttribute(
      "d",
      iconPaths[iconName][0].d,
    );
  });

  it("action을 주면 버튼을 누를 때 onClick이 호출된다", () => {
    const onClick = vi.fn();
    render(<Banner title="알림" action={{ label: "다시 시도", onClick }} />);

    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("action이 없으면 버튼이 없다", () => {
    render(<Banner title="알림" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
