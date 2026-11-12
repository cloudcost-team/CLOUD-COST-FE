import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";

const PERMISSIONS = [
  { action: "ec2:DescribeInstances", description: "서버 목록 읽기" },
  {
    action: "cloudwatch:GetMetricStatistics",
    description: "사용 시간·요청 수 지표 읽기",
  },
  { action: "ec2:DescribeRegions", description: "리전 목록 읽기" },
  { action: "ec2:DescribeVolumes", description: "볼륨 목록 읽기" },
  { action: "ec2:DescribeAddresses", description: "고정 IP 목록 읽기" },
  { action: "ec2:DescribeSnapshots", description: "내 스냅샷 목록 읽기" },
  {
    action: "elasticloadbalancing:DescribeLoadBalancers",
    description: "로드밸런서 목록 읽기",
  },
];

export function PermissionList({ className }: { className?: string }) {
  return (
    <Panel className={cn("flex flex-col gap-gap-medium", className)}>
      <div className="flex items-center gap-gap-small">
        <p className="text-label-xsmall text-text-strong">
          이 권한 {PERMISSIONS.length}개만 사용해요
        </p>
        <Badge tone="brand">모두 읽기 전용</Badge>
      </div>
      <dl className="flex flex-col gap-gap-medium">
        {PERMISSIONS.map((permission) => (
          <div
            key={permission.action}
            className="flex flex-wrap items-center gap-x-gap-large gap-y-gap-xsmall text-subtext-medium"
          >
            <dt className="flex w-80 items-center gap-gap-small text-text-primary">
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
      <p className="text-subtext-small text-text-quaternary">
        이 조회 기록은 고객 계정의 CloudTrail에 남아요. 기본 Trail 말고 Trail을
        더 쓰고 있다면 10만 건당 약 $2가 들 수 있어요.
      </p>
    </Panel>
  );
}
