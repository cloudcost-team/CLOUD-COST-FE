import { Suspense } from "react";
import { ConnectionDetailScreen } from "@/components/connection/ConnectionDetailScreen";
import { LoadingState } from "@/components/ui/LoadingState";

type ConnectionDetailPageProps = PageProps<"/settings/connections/[accountId]">;

async function ConnectionDetail({ params }: ConnectionDetailPageProps) {
  const { accountId } = await params;
  return <ConnectionDetailScreen accountId={accountId} />;
}

export default function ConnectionDetailPage(props: ConnectionDetailPageProps) {
  return (
    <Suspense fallback={<LoadingState title="연결 정보를 불러오고 있어요" />}>
      <ConnectionDetail {...props} />
    </Suspense>
  );
}
