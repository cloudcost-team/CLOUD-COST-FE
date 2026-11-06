import { Suspense } from "react";
import { SimulatorScreen } from "@/components/savings/SimulatorScreen";
import { simulationSample } from "@/components/savings/simulatorSample";
import { LoadingState } from "@/components/ui/LoadingState";

type SimulatorSearchParams = Promise<{ recommendationId?: string }>;

async function RequestTimeSimulator({
  searchParams,
}: {
  searchParams: SimulatorSearchParams;
}) {
  const { recommendationId } = await searchParams;
  return (
    <SimulatorScreen
      data={simulationSample}
      initialRecommendationId={recommendationId}
    />
  );
}

export default function SimulatorPage({
  searchParams,
}: {
  searchParams: SimulatorSearchParams;
}) {
  return (
    <Suspense fallback={<LoadingState title="시뮬레이터를 불러오고 있어요" />}>
      <RequestTimeSimulator searchParams={searchParams} />
    </Suspense>
  );
}
