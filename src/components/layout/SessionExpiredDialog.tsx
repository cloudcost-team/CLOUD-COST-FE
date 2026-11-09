"use client";

import { Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { clearAccessToken, saveReturnPath } from "@/lib/authSession";
import { useSessionExpiredStore } from "@/stores/sessionExpiredStore";

const SCREEN_NAMES: [prefix: string, name: string][] = [
  ["/settings/connections/new", "새 연결"],
  ["/settings/connections/", "연결 상세"],
  ["/settings/connections", "데이터 연결"],
  ["/settings/alerts", "알림 설정"],
  ["/savings/waste", "낭비 리소스"],
  ["/savings/simulator", "비용 시뮬레이터"],
  ["/benchmark", "팀 벤치마킹"],
  ["/reports", "월간 리포트"],
  ["/notifications", "알림"],
  ["/dashboard", "대시보드"],
  ["/onboarding", "연결 시작"],
];

function getScreenName(pathname: string) {
  return SCREEN_NAMES.find(([prefix]) => pathname.startsWith(prefix))?.[1];
}

function SessionExpiredModal() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const expired = useSessionExpiredStore((state) => state.expired);
  const reset = useSessionExpiredStore((state) => state.reset);
  const screenName = getScreenName(pathname);

  function loginAgain() {
    saveReturnPath(pathname);
    clearAccessToken();
    queryClient.clear();
    reset();
    router.replace("/login");
  }

  return (
    <Modal
      open={expired}
      onClose={() => {}}
      title="로그인이 만료됐어요"
      description={`로그인한 지 오래되어 다시 로그인이 필요해요. 다시 로그인하면 보던 화면${screenName ? `(${screenName})` : ""}으로 돌아와요.`}
      className="w-95"
    >
      <div className="px-padding-xlarge pt-padding-small pb-padding-xlarge">
        <Button className="w-full" onClick={loginAgain} data-autofocus>
          Google로 다시 로그인
        </Button>
      </div>
    </Modal>
  );
}

export function SessionExpiredDialog() {
  return (
    <Suspense fallback={null}>
      <SessionExpiredModal />
    </Suspense>
  );
}
