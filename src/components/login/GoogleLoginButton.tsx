"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { GoogleIdentityError, renderGoogleButton } from "@/lib/googleIdentity";
import { cn } from "@/lib/cn";

type GoogleLoginButtonProps = {
  clientId: string;
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
  className?: string;
};

export function GoogleLoginButton({
  clientId,
  onCredential,
  onError,
  className,
}: GoogleLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleCredential = useEffectEvent(onCredential);
  const handleError = useEffectEvent(onError);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    renderGoogleButton(container, clientId, handleCredential).catch((error) =>
      handleError(
        error instanceof GoogleIdentityError
          ? error.message
          : "Google 로그인을 시작하지 못했습니다.",
      ),
    );
  }, [clientId]);

  return (
    <div
      ref={containerRef}
      className={cn("flex h-12 items-center justify-center", className)}
    />
  );
}
