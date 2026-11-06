"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/LoadingState";
import { hasValidLoginSession } from "@/lib/authSession";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(hasValidLoginSession() ? "/dashboard" : "/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-lower">
      <LoadingState title="로그인 상태를 확인하고 있어요" />
    </main>
  );
}
