import type { AwsAccountStatus } from "@/api/awsAccounts";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const STATUS_BADGES: Record<
  AwsAccountStatus,
  { label: string; tone: BadgeTone }
> = {
  ACTIVE: { label: "정상", tone: "success" },
  PENDING: { label: "연결 대기", tone: "info" },
  ERROR: { label: "오류", tone: "danger" },
  DISCONNECTED: { label: "연결 끊김", tone: "neutral" },
};

export function getConnectionStatusLabel(status: AwsAccountStatus) {
  return STATUS_BADGES[status].label;
}

export function ConnectionStatusBadge({
  status,
}: {
  status: AwsAccountStatus;
}) {
  const badge = STATUS_BADGES[status];
  return <Badge tone={badge.tone}>{badge.label}</Badge>;
}
