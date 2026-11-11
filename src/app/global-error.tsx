"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Banner } from "@/components/ui/Banner";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="flex min-h-screen items-center justify-center p-6">
        <Banner
          title="화면을 불러오지 못했어요"
          description="잠시 뒤 다시 시도해 주세요."
          action={{ label: "다시 시도", onClick: reset }}
        />
      </body>
    </html>
  );
}
