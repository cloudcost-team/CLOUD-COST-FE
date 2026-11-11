import { Card } from "@/components/ui/Card";
import { NumberedSteps } from "@/components/ui/NumberedSteps";
import { PermissionList } from "./PermissionList";

const CONNECTION_STEPS = [
  "연결 이름과 EC2 서버가 있는 리전을 정하고 [AWS 콘솔에서 스택 만들기]를 눌러요",
  "새 탭에 열린 AWS 콘솔에서 [스택 생성]을 눌러요",
  "스택이 만들어지면 연결을 자동으로 확인해요",
];

export function ConnectionGuide() {
  return (
    <aside className="self-start">
      <Card title="연결 과정">
        <NumberedSteps steps={CONNECTION_STEPS} />
        <p className="text-subtext-medium text-text-tertiary">
          CloudFormation 빠른 생성 링크로 읽기 전용 역할을 만들어요. 보통 1~2분
          안에 연결돼요.
        </p>
        <PermissionList />
      </Card>
    </aside>
  );
}
