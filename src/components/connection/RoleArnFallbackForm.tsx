"use client";

import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type RoleArnFallbackFormProps = {
  onSubmit: (roleArn: string) => void;
  loading?: boolean;
  error?: string;
  description?: string;
  className?: string;
};

export function RoleArnFallbackForm({
  onSubmit,
  loading = false,
  error,
  description = "스택은 만들어졌는데 연결이 안 됐다면, 스택 [출력(Outputs)] 탭의 RoleArn 값을 붙여 넣어 주세요.",
  className,
}: RoleArnFallbackFormProps) {
  const [roleArn, setRoleArn] = useState("");
  const [emptyError, setEmptyError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = roleArn.trim();
    if (!trimmed) {
      setEmptyError("Role ARN을 입력해 주세요.");
      return;
    }
    setEmptyError(undefined);
    onSubmit(trimmed);
  }

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-gap-large">
        <div className="flex flex-col gap-gap-xsmall">
          <div className="flex items-center gap-gap-small">
            <h2 className="text-title-xsmall text-text-strong">
              Role ARN 직접 등록
            </h2>
            <Badge>예비 경로</Badge>
          </div>
          <p className="text-subtext-medium text-text-tertiary">
            {description}
          </p>
        </div>
        <Input
          label="Role ARN"
          placeholder="arn:aws:iam::123456789012:role/CloudCostReadOnlyRole"
          value={roleArn}
          onChange={(event) => setRoleArn(event.currentTarget.value)}
          error={emptyError ?? error}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="flex justify-end">
          <Button type="submit" size="medium" loading={loading}>
            확인
          </Button>
        </div>
      </form>
    </Card>
  );
}
