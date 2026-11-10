import type { Metadata } from "next";
import { Suspense } from "react";
import { ReportDetailScreen } from "@/components/report/ReportDetailScreen";
import { LoadingState } from "@/components/ui/LoadingState";

type DemoReportPageProps = PageProps<"/demo/reports/[month]">;

async function DemoReportDetail({ params }: DemoReportPageProps) {
  const { month } = await params;
  return <ReportDetailScreen month={month} />;
}

export const metadata: Metadata = { title: "체험 월간 리포트" };

export default function DemoReportPage(props: DemoReportPageProps) {
  return (
    <Suspense fallback={<LoadingState title="리포트를 불러오고 있어요" />}>
      <DemoReportDetail {...props} />
    </Suspense>
  );
}
