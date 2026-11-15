import type { Metadata } from "next";
import { Suspense } from "react";
import { SimulatorScreen } from "@/components/savings/SimulatorScreen";
import { LoadingState } from "@/components/ui/LoadingState";

type DemoSimulatorPageProps = PageProps<"/demo/savings/simulator">;

async function DemoSimulator({ searchParams }: DemoSimulatorPageProps) {
  const { recommendationId } = await searchParams;
  return (
    <SimulatorScreen
      initialRecommendationId={
        typeof recommendationId === "string" ? recommendationId : undefined
      }
    />
  );
}

export const metadata: Metadata = { title: "체험 비용 시뮬레이터" };

export default function DemoSimulatorPage(props: DemoSimulatorPageProps) {
  return (
    <Suspense fallback={<LoadingState title="시뮬레이터를 불러오고 있어요" />}>
      <DemoSimulator {...props} />
    </Suspense>
  );
}
