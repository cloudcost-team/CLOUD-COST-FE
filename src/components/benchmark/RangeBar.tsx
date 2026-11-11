"use client";

import type { CSSProperties } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useProfilePicture } from "@/hooks/useProfilePicture";
import { cn } from "@/lib/cn";

export type SpendScale = {
  rangeStart: number;
  rangeEnd: number;
  marker: number;
  afterMarker: number | null;
  startLabel: string;
  endLabel: string;
  oursLabel: string;
  afterLabel: string | null;
};

type RangeBarProps = {
  scale: SpendScale;
  rangeLabel: string;
  showAfter: boolean;
  className?: string;
};

export function RangeBar({
  scale,
  rangeLabel,
  showAfter,
  className,
}: RangeBarProps) {
  const pictureUrl = useProfilePicture();
  const afterVisible = showAfter && scale.afterMarker !== null;
  const positions = {
    "--range-start": `${scale.rangeStart}%`,
    "--range-end": `${100 - scale.rangeEnd}%`,
    "--marker": `${scale.marker}%`,
    "--after-marker": `${scale.afterMarker ?? 0}%`,
  } as CSSProperties;

  return (
    <div
      className={cn("flex min-w-0 flex-col gap-gap-small", className)}
      style={positions}
    >
      <div className="flex items-start justify-between">
        <span className="text-subtext-small text-text-quaternary">
          {scale.startLabel}
        </span>
        <span className="text-subtext-small text-text-quaternary">
          {scale.endLabel}
        </span>
      </div>
      <div
        role="img"
        aria-label={`${rangeLabel} 안에서 우리 팀 ${scale.oursLabel}`}
        className="relative h-14 w-full rounded-large bg-fill-neutral-weak/70"
      >
        <div className="absolute inset-y-0 right-(--range-end) left-(--range-start) flex items-center justify-center overflow-hidden rounded-large bg-fill-brand-weak">
          <span className="text-label-xsmall text-text-brand">
            {rangeLabel}
          </span>
        </div>
        {afterVisible && (
          <span className="absolute inset-y-0 left-(--after-marker) w-0 -translate-x-1/2 border-l-2 border-dashed border-border-brand" />
        )}
      </div>
      <div className="relative h-9">
        <div className="absolute top-0 left-(--marker) flex -translate-x-1/2 flex-col items-center gap-gap-xxsmall">
          <span className="size-0 border-x-5 border-b-6 border-x-transparent border-b-fill-brand-strong" />
          <ProfileAvatar
            pictureUrl={pictureUrl}
            size={28}
            className="size-7 border-2 border-fill-default shadow-default"
          />
        </div>
      </div>
    </div>
  );
}
