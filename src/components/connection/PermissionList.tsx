import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";

const PERMISSIONS = [
  { action: "ec2:DescribeInstances", description: "인스턴스 목록 읽기" },
  {
    action: "cloudwatch:GetMetricStatistics",
    description: "사용 시간 지표 읽기",
  },
];

export function PermissionList({ className }: { className?: string }) {
  return (
    <Panel className={cn("flex flex-col gap-gap-medium", className)}>
      <div className="flex items-center gap-gap-small">
        <p className="text-label-xsmall text-text-strong">
          이 권한 {PERMISSIONS.length}개만 사용해요
        </p>
        <Badge tone="brand">읽기 전용</Badge>
      </div>
      <dl className="flex flex-col gap-gap-medium">
        {PERMISSIONS.map((permission) => (
          <div
            key={permission.action}
            className="flex flex-wrap items-center gap-x-gap-large gap-y-gap-xsmall text-subtext-medium"
          >
            <dt className="w-60 text-text-primary">{permission.action}</dt>
            <dd className="text-text-tertiary">{permission.description}</dd>
          </div>
        ))}
      </dl>
      <p className="text-subtext-small text-text-quaternary">
        Access Key는 받지 않아요. 고객 AWS 리소스를 만들거나 바꾸지 않아요.
      </p>
    </Panel>
  );
}
