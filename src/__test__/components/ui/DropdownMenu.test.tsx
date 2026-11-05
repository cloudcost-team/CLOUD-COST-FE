import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  type DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import { iconPaths } from "@/components/ui/iconPaths";

function Controlled({
  items,
  initialOpen = true,
}: {
  items: DropdownMenuItem[];
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        aria-label="리전"
        items={items}
        trigger={({ ref, ...props }) => (
          <button type="button" ref={ref} {...props}>
            열기
          </button>
        )}
      />
      <button type="button">바깥</button>
    </div>
  );
}

function plainItems(onSelect = vi.fn()): DropdownMenuItem[] {
  return [
    { key: "a", label: "서울", onSelect },
    { type: "separator", key: "sep" },
    { key: "b", label: "도쿄", onSelect },
    { key: "c", label: "오사카", onSelect },
  ];
}

describe("DropdownMenu", () => {
  it("열면 menu가 보이고 selected가 없으면 첫 항목에 포커스한다", () => {
    render(<Controlled items={plainItems()} initialOpen={false} />);

    fireEvent.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("menu", { name: "리전" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "서울" })).toHaveFocus();
  });

  it("selected 항목이 있으면 그 항목에 포커스한다", () => {
    const onSelect = vi.fn();
    render(
      <Controlled
        items={[
          { key: "a", label: "서울", selected: false, onSelect },
          { key: "b", label: "도쿄", selected: true, onSelect },
        ]}
      />,
    );

    expect(screen.getByRole("menuitemradio", { name: "도쿄" })).toHaveFocus();
  });

  it("ArrowDown은 구분선을 건너뛰고 다음 항목으로 이동한다", () => {
    render(<Controlled items={plainItems()} />);

    fireEvent.keyDown(screen.getByRole("menuitem", { name: "서울" }), {
      key: "ArrowDown",
    });

    expect(screen.getByRole("menuitem", { name: "도쿄" })).toHaveFocus();
  });

  it("ArrowUp은 첫 항목에서 마지막 항목으로 순환한다", () => {
    render(<Controlled items={plainItems()} />);

    fireEvent.keyDown(screen.getByRole("menuitem", { name: "서울" }), {
      key: "ArrowUp",
    });

    expect(screen.getByRole("menuitem", { name: "오사카" })).toHaveFocus();
  });

  it("End는 마지막 항목으로, Home은 첫 항목으로 이동한다", () => {
    render(<Controlled items={plainItems()} />);
    const menu = screen.getByRole("menu");

    fireEvent.keyDown(menu, { key: "End" });
    expect(screen.getByRole("menuitem", { name: "오사카" })).toHaveFocus();

    fireEvent.keyDown(menu, { key: "Home" });
    expect(screen.getByRole("menuitem", { name: "서울" })).toHaveFocus();
  });

  it("항목을 클릭하면 onSelect를 호출하고 메뉴가 닫히며 트리거로 포커스가 돌아간다", () => {
    const onSelect = vi.fn();
    render(<Controlled items={plainItems(onSelect)} />);

    fireEvent.click(screen.getByRole("menuitem", { name: "도쿄" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button", { name: "열기" })).toHaveFocus();
  });

  it("selected가 지정된 항목은 menuitemradio이고 aria-checked를 반영한다", () => {
    const onSelect = vi.fn();
    render(
      <Controlled
        items={[
          { key: "a", label: "서울", selected: false, onSelect },
          { key: "b", label: "도쿄", selected: true, onSelect },
        ]}
      />,
    );

    expect(screen.getByRole("menuitemradio", { name: "서울" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("menuitemradio", { name: "도쿄" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("선택된 항목에만 selected를 줘도 모든 항목을 radio로 노출한다", () => {
    const onSelect = vi.fn();
    render(
      <Controlled
        items={[
          { key: "a", label: "서울", onSelect },
          { key: "b", label: "도쿄", selected: true, onSelect },
        ]}
      />,
    );

    expect(screen.getByRole("menuitemradio", { name: "서울" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("menuitemradio", { name: "도쿄" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.queryByRole("menuitem")).toBeNull();
  });

  it("선택된 항목에만 check 아이콘을 표시한다", () => {
    const onSelect = vi.fn();
    render(
      <Controlled
        items={[
          { key: "a", label: "서울", selected: false, onSelect },
          { key: "b", label: "도쿄", selected: true, onSelect },
        ]}
      />,
    );
    const checkPath = iconPaths.check[0].d;

    const selected = screen.getByRole("menuitemradio", { name: "도쿄" });
    const unselected = screen.getByRole("menuitemradio", { name: "서울" });
    expect(selected.querySelector(`path[d="${checkPath}"]`)).not.toBeNull();
    expect(unselected.querySelector(`path[d="${checkPath}"]`)).toBeNull();
  });

  it("tone이 danger이면 글자가 위험 색이다", () => {
    render(
      <Controlled
        items={[{ key: "a", label: "삭제", tone: "danger", onSelect: vi.fn() }]}
      />,
    );

    expect(screen.getByText("삭제")).toHaveClass("text-text-danger");
  });

  it("Escape를 누르면 닫히고 트리거로 포커스가 돌아간다", () => {
    render(<Controlled items={plainItems()} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button", { name: "열기" })).toHaveFocus();
  });

  it("바깥을 pointerDown하면 닫힌다", () => {
    render(<Controlled items={plainItems()} />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "바깥" }));

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("메뉴에서 Tab을 누르면 닫힌다", () => {
    render(<Controlled items={plainItems()} />);

    fireEvent.keyDown(screen.getByRole("menuitem", { name: "서울" }), {
      key: "Tab",
    });

    expect(screen.queryByRole("menu")).toBeNull();
  });
});
