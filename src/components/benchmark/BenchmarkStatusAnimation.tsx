"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

export type BenchmarkStatus = "good" | "medium" | "risk";

const statusDetails: Record<BenchmarkStatus, { label: string; path: string }> =
  {
    good: { label: "양호", path: "/animations/benchmark/good.json" },
    medium: { label: "보통", path: "/animations/benchmark/medium.json" },
    risk: { label: "위험", path: "/animations/benchmark/risk.json" },
  };

export function BenchmarkStatusAnimation({
  status,
}: {
  status: BenchmarkStatus;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: AnimationItem | null = null;
    let disposed = false;

    const syncPlayback = () => {
      if (!animation) return;
      if (reducedMotion.matches) animation.goToAndStop(0, true);
      else animation.play();
    };

    reducedMotion.addEventListener("change", syncPlayback);

    // 브라우저에서만 플레이어를 불러와 Next.js 서버 렌더링과 분리한다.
    void import("lottie-web").then(({ default: lottie }) => {
      if (disposed || !containerRef.current) return;
      animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: !reducedMotion.matches,
        path: statusDetails[status].path,
      });
      if (reducedMotion.matches) {
        animation.addEventListener("DOMLoaded", syncPlayback);
      }
    });

    return () => {
      disposed = true;
      reducedMotion.removeEventListener("change", syncPlayback);
      animation?.destroy();
    };
  }, [status]);

  return (
    <div
      role="img"
      aria-label={statusDetails[status].label}
      className="size-24"
    >
      <div ref={containerRef} aria-hidden="true" className="size-full" />
    </div>
  );
}
