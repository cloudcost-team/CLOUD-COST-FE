import { Suspense } from "react";
import { ReportDetailScreen } from "@/components/report/ReportDetailScreen";
import { LoadingState } from "@/components/ui/LoadingState";

type ReportPageProps = PageProps<"/reports/[month]">;

async function ReportDetail({ params }: ReportPageProps) {
  const { month } = await params;
  return <ReportDetailScreen month={month} />;
}

export default function ReportPage(props: ReportPageProps) {
  return (
    <Suspense fallback={<LoadingState title="리포트를 불러오고 있어요" />}>
      <ReportDetail {...props} />
    </Suspense>
  );
}
