import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type MarkerAlign = "start" | "center" | "end";

const alignClasses: Record<MarkerAlign, { items: string; translate: string }> =
  {
    start: { items: "items-start", translate: "translate-x-0" },
    center: { items: "items-center", translate: "-translate-x-1/2" },
    end: { items: "items-end", translate: "-translate-x-full" },
  };

function getAlign(position: number | undefined): MarkerAlign {
  if (position === undefined) return "center";
  if (position < 10) return "start";
  if (position > 90) return "end";
  return "center";
}

type OursMarkerProps = {
  position?: number;
  label?: string;
  pointer?: boolean;
};

export function OursMarker({
  position,
  label = "우리 팀",
  pointer = true,
}: OursMarkerProps) {
  const align = alignClasses[getAlign(position)];
  const callout = (
    <div className={cn("flex flex-col gap-gap-xxsmall", align.items)}>
      <span className="rounded-medium border border-border-brand bg-background-floated px-padding-xsmall py-padding-xxsmall text-label-xsmall whitespace-nowrap text-text-strong shadow-default">
        {label}
      </span>
      {pointer && <span aria-hidden className="h-3 w-0.5 bg-fill-brand" />}
    </div>
  );

  if (position === undefined) return callout;

  return (
    <div
      className="relative h-12"
      style={{ "--ours-marker": `${position}%` } as CSSProperties}
    >
      <div
        className={cn(
          "absolute bottom-0 left-(--ours-marker)",
          align.translate,
        )}
      >
        {callout}
      </div>
    </div>
  );
}
