import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "@/components/ui/Divider";

describe("Divider", () => {
  it("label이 없으면 separator 하나만 있고 문구는 없다", () => {
    const { container } = render(<Divider />);

    expect(screen.getAllByRole("separator")).toHaveLength(1);
    expect(container).toHaveTextContent("");
  });

  it("label을 주면 문구가 보이고 separator 이름으로 찾힌다", () => {
    render(<Divider label="또는" />);

    expect(screen.getByText("또는")).toBeInTheDocument();
    expect(screen.getByRole("separator", { name: "또는" })).toBeInTheDocument();
  });
});
