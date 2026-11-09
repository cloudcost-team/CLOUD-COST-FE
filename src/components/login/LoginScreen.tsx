"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/api/client";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAuthConfig, useGoogleLogin } from "@/hooks/useAuth";
import { setAccessToken, takeReturnPath } from "@/lib/authSession";
import {
  GoogleIdentityError,
  requestGoogleCredential,
} from "@/lib/googleIdentity";
import { LoginIllustration } from "./LoginIllustration";

export function LoginScreen() {
  const router = useRouter();
  const authConfig = useAuthConfig();
  const googleLogin = useGoogleLogin();
  const [loginError, setLoginError] = useState<string>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleGoogleLogin() {
    if (isLoggingIn) return;
    setLoginError(undefined);
    setIsLoggingIn(true);

    try {
      const configResult = await authConfig.refetch();
      if (configResult.error) throw configResult.error;

      if (!configResult.data?.googleClientId) {
        setLoginError("Google 로그인을 사용할 수 없습니다.");
        return;
      }

      const idToken = await requestGoogleCredential(
        configResult.data.googleClientId,
      );
      const session = await googleLogin.mutateAsync({ idToken });
      setAccessToken(session.accessToken);
      router.push(takeReturnPath() ?? "/dashboard");
    } catch (error) {
      setLoginError(
        error instanceof ApiError || error instanceof GoogleIdentityError
          ? error.message
          : "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="auth-page-background flex min-h-screen items-center justify-center p-margin-screen md:p-spacing-xxxlarge">
      <section className="grid min-h-[680px] w-full max-w-[1240px] grid-cols-1 grid-rows-[auto_1fr] gap-y-spacing-large overflow-hidden rounded-[22px] border border-border-default bg-background-default/95 p-spacing-large shadow-strong md:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(400px,540px)] lg:gap-x-[55px]">
        <Logo className="lg:col-span-2" />

        <div className="flex min-w-0 flex-col justify-center lg:justify-start lg:pt-26 lg:pl-12">
          <p className="text-title-xsmall-xweak text-text-brand">
            AWS COST INTELLIGENCE
          </p>
          <h1 className="mt-gap-xsmall text-display-large text-text-strong">
            AWS 비용,
            <br />
            어디서 새는지 한눈에 확인하세요
          </h1>
          <p className="mt-spacing-small max-w-[470px] text-label-medium-weak text-text-secondary">
            CloudCost는 AWS EC2 비용 흐름과 이상 징후를 한눈에 보여주고,
            <br className="hidden xl:block" /> 낭비되는 리소스를 빠르게 찾도록
            도와드려요.
          </p>
          <div className="mt-spacing-small flex max-w-[500px] flex-col gap-gap-medium sm:flex-row">
            <Button
              className="flex-1"
              loading={isLoggingIn}
              onClick={handleGoogleLogin}
            >
              Google로 계속하기
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => router.push("/demo/login")}
            >
              무료로 둘러보기
            </Button>
          </div>
          {loginError && (
            <Banner
              className="mt-spacing-small max-w-[500px]"
              title={loginError}
              description="로그인을 사용할 수 없으면 체험 모드로 먼저 둘러볼 수 있어요."
            />
          )}
        </div>

        <div className="hidden items-start lg:flex">
          <LoginIllustration />
        </div>
      </section>
    </main>
  );
}
