"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/api/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { TextLink } from "@/components/ui/TextLink";
import { useDemoLogin } from "@/hooks/useDemoLogin";

export function DemoLoginScreen() {
  const router = useRouter();
  const demoLogin = useDemoLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const error =
    demoLogin.error instanceof ApiError
      ? demoLogin.error.message
      : demoLogin.isError
        ? "체험 로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
        : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const account = await demoLogin.mutateAsync({ username, password });
      sessionStorage.setItem("cloudcost.demoAccount", JSON.stringify(account));
      router.push("/demo/setup");
    } catch {
      // 오류 문구는 mutation 상태를 통해 입력 필드에 표시한다.
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-lower px-margin-screen py-spacing-xxxlarge">
      <div className="flex w-full max-w-[400px] flex-col items-start gap-spacing-medium">
        <Logo />

        <div className="flex flex-col items-start gap-gap-small">
          <Badge tone="brand">체험 모드</Badge>
          <h1 className="text-display-small text-text-strong">
            AWS 계정 없이 둘러보기
          </h1>
          <p className="text-subtext-large text-text-tertiary">
            예시 서버로 비용 화면을 미리 볼 수 있어요.
            <br />
            실제 AWS와는 연결되지 않아요.
          </p>
        </div>

        <Card className="w-full gap-gap-large p-padding-xlarge">
          <div className="rounded-large bg-fill-brand-weak p-padding-medium">
            <p className="text-subtext-small text-text-brand">
              체험용 계정 (누구나 사용 가능)
            </p>
            <p className="mt-gap-xxsmall text-subtext-medium-strong text-text-primary">
              아이디 cloudcost · 비밀번호 1234
            </p>
          </div>

          <form className="flex flex-col gap-gap-large" onSubmit={handleSubmit}>
            <Input
              label="아이디"
              name="username"
              autoComplete="username"
              placeholder="아이디 입력"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
              required
              maxLength={64}
              disabled={demoLogin.isPending}
            />
            <Input
              label="비밀번호"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
              maxLength={64}
              disabled={demoLogin.isPending}
              error={error}
            />
            <Button
              type="submit"
              loading={demoLogin.isPending}
              className="w-full"
            >
              체험 시작
            </Button>
          </form>
        </Card>

        <div className="flex w-full justify-center">
          <TextLink href="/login" tone="neutral" icon={null}>
            <span className="underline">로그인으로 돌아가기</span>
          </TextLink>
        </div>
      </div>
    </main>
  );
}
