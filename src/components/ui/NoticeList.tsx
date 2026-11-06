import { cn } from "@/lib/cn";
import { Panel } from "./Panel";

type NoticeListVariant = "box" | "plain";

type NoticeListProps = {
  lines: string[];
  variant?: NoticeListVariant;
  className?: string;
};

export function NoticeList({
  lines,
  variant = "box",
  className,
}: NoticeListProps) {
  if (lines.length === 0) return null;
  const items = lines.map((line) => <li key={line}>· {line}</li>);

  if (variant === "plain")
    return (
      <ul
        className={cn(
          "flex flex-col gap-gap-xxsmall text-subtext-small text-text-quaternary",
          className,
        )}
      >
        {items}
      </ul>
    );

  return (
    <Panel
      as="ul"
      size="medium"
      className={cn(
        "flex flex-col gap-gap-xsmall text-subtext-medium text-text-tertiary",
        className,
      )}
    >
      {items}
    </Panel>
  );
}
