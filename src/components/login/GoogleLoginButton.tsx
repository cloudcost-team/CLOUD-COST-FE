"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  createGoogleCodeClient,
  GoogleIdentityError,
  type GoogleCodeClient,
} from "@/lib/googleIdentity";

type GoogleLoginButtonProps = {
  clientId: string;
  onCode: (code: string) => void;
  onError: (message: string) => void;
  className?: string;
};

export function GoogleLoginButton({
  clientId,
  onCode,
  onError,
  className,
}: GoogleLoginButtonProps) {
  const [codeClient, setCodeClient] = useState<GoogleCodeClient | null>();
  const handleCode = useEffectEvent(onCode);
  const handleError = useEffectEvent(onError);

  useEffect(() => {
    let active = true;
    createGoogleCodeClient(clientId, handleCode, handleError)
      .then((client) => {
        if (active) setCodeClient(client);
      })
      .catch((error) => {
        if (!active) return;
        setCodeClient(null);
        handleError(
          error instanceof GoogleIdentityError
            ? error.message
            : "Google 로그인을 시작하지 못했습니다.",
        );
      });
    return () => {
      active = false;
      setCodeClient(undefined);
    };
  }, [clientId]);

  return (
    <Button
      className={className}
      loading={codeClient === undefined}
      disabled={codeClient === null}
      onClick={() => codeClient?.requestCode()}
    >
      Google로 계속하기
    </Button>
  );
}
