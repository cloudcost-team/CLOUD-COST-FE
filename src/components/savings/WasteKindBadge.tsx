import type { WasteItem } from "@/api/waste";
import { Badge } from "@/components/ui/Badge";

type WasteKindBadgeProps = Pick<WasteItem, "kind" | "kindLabel">;

export function WasteKindBadge({ kind, kindLabel }: WasteKindBadgeProps) {
  return (
    <Badge tone={kind === "IDLE" ? "warning" : "brand"}>{kindLabel}</Badge>
  );
}
