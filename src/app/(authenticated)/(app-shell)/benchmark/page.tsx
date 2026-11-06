import { BenchmarkScreen } from "@/components/benchmark/BenchmarkScreen";
import {
  benchmarkDistributionSample,
  benchmarkSample,
  benchmarkSpendScaleSample,
  selectedMonthlySavingsSample,
} from "@/components/benchmark/benchmarkSample";

export default function BenchmarkPage() {
  return (
    <BenchmarkScreen
      data={benchmarkSample}
      isPending={false}
      distribution={benchmarkDistributionSample}
      spendScale={benchmarkSpendScaleSample}
      selectedMonthlySavings={selectedMonthlySavingsSample}
    />
  );
}
