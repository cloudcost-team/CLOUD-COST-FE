import { SimulatorScreen } from "@/components/savings/SimulatorScreen";
import { simulationSample } from "@/components/savings/simulatorSample";

export default async function SimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ recommendationId?: string }>;
}) {
  const { recommendationId } = await searchParams;
  return (
    <SimulatorScreen
      data={simulationSample}
      initialRecommendationId={recommendationId}
    />
  );
}
