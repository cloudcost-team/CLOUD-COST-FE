import { cn } from "@/lib/cn";

export type InteractionOverlayTone = "neutral" | "onFill" | "brand";

const toneClasses: Record<InteractionOverlayTone, string> = {
  neutral:
    "bg-fill-neutral group-hover:opacity-[0.05] group-active:opacity-[0.12]",
  onFill:
    "bg-fill-default group-hover:opacity-[0.14] group-active:opacity-[0.30]",
  brand: "bg-fill-brand group-hover:opacity-[0.14] group-active:opacity-[0.30]",
};

type InteractionOverlayProps = {
  tone: InteractionOverlayTone;
  className?: string;
};

export function InteractionOverlay({
  tone,
  className,
}: InteractionOverlayProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity",
        toneClasses[tone],
        className,
      )}
    />
  );
}
