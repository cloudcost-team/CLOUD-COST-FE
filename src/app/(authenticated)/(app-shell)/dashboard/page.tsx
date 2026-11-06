import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import {
  costsSummarySample,
  dailyCostsSample,
  dashboardKrwSample,
  dashboardUsdSample,
  instancesSample,
  monthlyCostsSample,
} from "@/components/dashboard/dashboardSample";

export default function DashboardPage() {
  return (
    <DashboardScreen
      krw={dashboardKrwSample}
      usd={dashboardUsdSample}
      daily={dailyCostsSample.days}
      monthly={monthlyCostsSample}
      costs={costsSummarySample}
      instances={instancesSample}
    />
  );
}
