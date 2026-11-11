"use client";

import { useState } from "react";
import type { WasteSkipped } from "@/api/waste";
import { Popover } from "@/components/ui/Popover";
import { TextButton } from "@/components/ui/TextButton";

type SkippedServersPopoverProps = {
  skipped: WasteSkipped[];
};

export function SkippedServersPopover({ skipped }: SkippedServersPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="판단에서 뺀 서버"
      helper="이 서버들은 추천과 절감액에 들어가지 않아요."
      trigger={(props) => (
        <TextButton {...props} icon="chevron-down">
          판단 제외 {skipped.length}대
        </TextButton>
      )}
    >
      <ul className="flex flex-col gap-gap-medium">
        {skipped.map((server) => (
          <li key={server.instanceId} className="flex flex-col gap-gap-xxsmall">
            <p className="text-subtext-medium-strong text-text-strong">
              {server.name ?? server.instanceId}
            </p>
            <p className="text-subtext-small text-text-tertiary">
              {server.reason}
            </p>
          </li>
        ))}
      </ul>
    </Popover>
  );
}
