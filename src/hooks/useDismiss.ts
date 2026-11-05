import { useEffect, useRef, type RefObject } from "react";

export type DismissReason = "escape" | "outside";

const dismissLayerStack: symbol[] = [];

export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onDismiss: (reason: DismissReason) => void,
) {
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open) return;

    const layerId = Symbol("dismiss-layer");
    dismissLayerStack.push(layerId);

    function isTopLayer() {
      return dismissLayerStack.at(-1) === layerId;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        isTopLayer() &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        onDismissRef.current("outside");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isTopLayer()) {
        event.preventDefault();
        event.stopPropagation();
        onDismissRef.current("escape");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      const layerIndex = dismissLayerStack.indexOf(layerId);
      if (layerIndex >= 0) dismissLayerStack.splice(layerIndex, 1);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, open]);
}
