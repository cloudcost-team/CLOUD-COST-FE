"use client";

import { useState, type FormEvent } from "react";
import type { CreateAwsAccountRequest } from "@/api/awsAccounts";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectBox, type SelectBoxOption } from "@/components/ui/SelectBox";
import { TextLink } from "@/components/ui/TextLink";
import { ConnectionStepper } from "./ConnectionStepper";
import { PermissionList } from "./PermissionList";

const ALIAS_MAX_LENGTH = 40;

const REGION_OPTIONS: SelectBoxOption[] = [
  { value: "ap-northeast-2", label: "아시아 태평양 (서울) ap-northeast-2" },
  { value: "ap-northeast-1", label: "아시아 태평양 (도쿄) ap-northeast-1" },
  { value: "us-east-1", label: "미국 동부 (버지니아 북부) us-east-1" },
  { value: "us-west-2", label: "미국 서부 (오레곤) us-west-2" },
];

type ConnectionFormStepProps = {
  variant?: "onboarding" | "settings";
  onSubmit: (values: CreateAwsAccountRequest) => void;
  loading: boolean;
  error?: { code?: string; message: string };
};

export function ConnectionFormStep({
  variant = "onboarding",
  onSubmit,
  loading,
  error,
}: ConnectionFormStepProps) {
  const [alias, setAlias] = useState("");
  const [region, setRegion] = useState(REGION_OPTIONS[0].value);
  const aliasError =
    error?.code === "INVALID_ALIAS" ? error.message : undefined;
  const requestError = error && !aliasError ? error.message : undefined;
  const isOnboarding = variant === "onboarding";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ region, alias: alias.trim() || undefined });
  }

  const fields = (
    <>
      <Input
        label="연결 이름"
        placeholder="예: 운영 서버"
        helperText="비워 두면 '이름 없는 연결'로 보여요"
        maxLength={ALIAS_MAX_LENGTH}
        showCounter
        value={alias}
        onChange={(event) => setAlias(event.currentTarget.value)}
        error={aliasError}
      />
      <SelectBox
        label="리전"
        options={REGION_OPTIONS}
        value={region}
        onValueChange={setRegion}
      />
      <PermissionList />
    </>
  );
  const submit = (
    <>
      {requestError && (
        <Banner title="연결을 시작하지 못했어요" description={requestError} />
      )}
      <Button type="submit" icon="external-link" loading={loading}>
        AWS 콘솔에서 스택 만들기
      </Button>
    </>
  );

  if (!isOnboarding)
    return (
      <form onSubmit={handleSubmit}>
        <Card className="gap-spacing-medium">
          <ConnectionStepper currentStep={1} />
          {fields}
          {submit}
        </Card>
      </form>
    );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-spacing-medium">
      <ConnectionStepper currentStep={1} />
      <div className="flex flex-col gap-gap-small">
        <h1 className="text-display-small text-text-strong">
          AWS 계정을 연결해 주세요
        </h1>
        <p className="text-subtext-large text-text-tertiary">
          CloudFormation 빠른 생성 링크로 읽기 전용 역할을 만들어요.
          <br />
          AWS 콘솔에서 [스택 생성]만 누르면 보통 1~2분 안에 연결돼요.
        </p>
      </div>
      <Card className="gap-spacing-medium">{fields}</Card>
      {submit}
      <div className="flex items-center justify-center gap-gap-small">
        <p className="text-subtext-medium text-text-tertiary">
          AWS 계정이 없나요?
        </p>
        <TextLink href="/demo/login" icon="arrow-right">
          계정 없이 둘러보기
        </TextLink>
      </div>
    </form>
  );
}
