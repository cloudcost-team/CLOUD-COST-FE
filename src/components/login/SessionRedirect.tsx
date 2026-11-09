"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/LoadingState";
import { refreshAccessToken } from "@/api/client";
import { getAccessToken } from "@/lib/authSession";

export function SessionRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      const loggedIn =
        Boolean(getAccessToken()) || (await refreshAccessToken());
      router.replace(loggedIn ? "/dashboard" : "/login");
    }
    redirect();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-lower">
      <LoadingState title="로그인 상태를 확인하고 있어요" />
    </main>
  );
}
