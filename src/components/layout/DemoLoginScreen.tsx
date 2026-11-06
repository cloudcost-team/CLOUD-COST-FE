"use client";

import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { DemoSetupRequest } from "@/api/demo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { TextLink } from "@/components/ui/TextLink";
import { formatKstDate } from "@/lib/kstDate";

const DEMO_USERNAME = "cloudcost";
const DEMO_PASSWORD = "1234";

function createDefaultDemoSetup(): DemoSetupRequest {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 90);

  return {
    from: formatKstDate(from),
    to: formatKstDate(to),
    servers: [
      {
        name: "web-server",
        instanceType: "t3.medium",
        os: "LINUX",
        count: 2,
        schedule: "ALWAYS",
      },
      {
        name: "batch-worker",
        instanceType: "c5.large",
        os: "LINUX",
        count: 1,
        schedule: "WEEKDAY_OFFICE",
      },
      {
        name: "win-dev",
        instanceType: "t3.large",
        os: "WINDOWS",
        count: 1,
        schedule: "DAILY_HOURS",
        hoursPerDay: 8,
      },
    ],
  };
}

export function DemoLoginScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (username.trim() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      setError("아이디 또는 비밀번호가 맞지 않습니다.");
      return;
    }

    // 공개된 체험 계정은 실제 인증 정보가 아니므로 브라우저 세션에 체험 여부만 저장한다.
    sessionStorage.setItem(
      "cloudcost.demoAccount",
      JSON.stringify({ mode: "demo", username: DEMO_USERNAME }),
    );
    const setup = createDefaultDemoSetup();
    sessionStorage.setItem("cloudcost.demoSetup", JSON.stringify(setup));
    queryClient.setQueryData(["demo", "stored-setup"], setup);
    router.push("/demo/dashboard");
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
              onInput={() => setError(undefined)}
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
              onInput={() => setError(undefined)}
              error={error}
            />
            <Button type="submit" className="w-full">
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
