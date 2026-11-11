"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/api/client";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { useAuthConfig, useGoogleLogin } from "@/hooks/useAuth";
import { setAccessToken, takeReturnPath } from "@/lib/authSession";
import { useProfilePictureStore } from "@/stores/profilePictureStore";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { LoginIllustration } from "./LoginIllustration";

const sellingPoints = [
  "액세스 키 없이 읽기 전용 권한으로 연결해요",
  "여러 변경을 함께 골라 절감 효과를 미리 계산해요",
  "매출 없이도 비슷한 규모 팀과 비용 효율을 비교해요",
];

export function LoginScreen() {
  const router = useRouter();
  const authConfig = useAuthConfig();
  const googleLogin = useGoogleLogin();
  const [loginError, setLoginError] = useState<string>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const googleClientId = authConfig.data?.googleClientId;
  const configError = authConfig.isError
    ? authConfig.error instanceof ApiError
      ? authConfig.error.message
      : "Google 로그인 설정을 불러오지 못했습니다."
    : authConfig.isSuccess && !googleClientId
      ? "Google 로그인을 사용할 수 없습니다."
      : undefined;
  const errorMessage = loginError ?? configError;

  async function handleGoogleLogin(code: string) {
    if (isLoggingIn) return;
    setLoginError(undefined);
    setIsLoggingIn(true);

    try {
      const session = await googleLogin.mutateAsync({ code });
      setAccessToken(session.accessToken);
      const { email, picture } = session.user;
      useProfilePictureStore
        .getState()
        .save(picture ? { email, picture } : null);
      router.push(takeReturnPath() ?? "/dashboard");
    } catch (error) {
      setLoginError(
        error instanceof ApiError
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
            바꾸면 얼마나 줄어드는지 확인하세요
          </h1>
          <p className="mt-spacing-small max-w-[470px] text-label-medium-weak text-text-secondary">
            CloudCost는 EC2 사용률로 줄일 수 있는 서버를 찾고,
            <br className="hidden xl:block" /> 바꿨을 때 매달 아끼는 금액을
            근거와 함께 보여 드려요.
          </p>
          <ul className="mt-spacing-small flex flex-col gap-gap-small">
            {sellingPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-gap-small text-label-small text-text-primary"
              >
                <Icon name="check-circle" className="text-icon-brand" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-spacing-small flex max-w-[500px] flex-col gap-gap-medium sm:flex-row">
            {googleClientId && !isLoggingIn ? (
              <GoogleLoginButton
                className="flex-1"
                clientId={googleClientId}
                onCode={handleGoogleLogin}
                onError={setLoginError}
              />
            ) : (
              <Button
                className="flex-1"
                loading={isLoggingIn || authConfig.isPending}
                disabled
              >
                Google로 계속하기
              </Button>
            )}
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => router.push("/demo/login")}
            >
              무료로 둘러보기
            </Button>
          </div>
          {errorMessage && (
            <Banner
              className="mt-spacing-small max-w-[500px]"
              title={errorMessage}
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
