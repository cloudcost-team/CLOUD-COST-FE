import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
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
            <dt className="flex w-60 items-center gap-gap-small text-text-primary">
              <Icon
                name="check"
                size={16}
                className="shrink-0 text-icon-brand"
              />
              {permission.action}
            </dt>
            <dd className="text-text-tertiary">{permission.description}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
