import type { Currency } from "@/api/costs";
import type { InstanceCost } from "./DashboardScreen";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { formatMoney } from "@/lib/formatMoney";
import { InstanceStatus } from "./InstanceStatus";
import { formatHourlyCost, formatHours } from "./dashboardFormat";

type ServerCostTableProps = { rows: InstanceCost[]; currency: Currency };

export function ServerCostTable({ rows, currency }: ServerCostTableProps) {
  const columns: DataTableColumn<InstanceCost>[] = [
    {
      key: "name",
      header: "이름",
      className: "max-w-60",
      render: (row) => (
        <span className="block truncate" title={row.name ?? row.instanceId}>
          {row.name ?? row.instanceId}
        </span>
      ),
    },
    {
      key: "type",
      header: "타입",
      className: "whitespace-nowrap",
      render: (row) => row.instanceType,
    },
    {
      key: "state",
      header: "상태",
      className: "whitespace-nowrap",
      render: (row) => <InstanceStatus state={row.state} />,
    },
    {
      key: "hours",
      header: "사용 시간",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) => formatHours(row.usageHours),
    },
    {
      key: "hourly",
      header: "시간당 단가",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) =>
        row.estimatedHourlyCost === null ? (
          <span className="text-text-tertiary">단가 없음</span>
        ) : (
          formatHourlyCost(row.estimatedHourlyCost, currency)
        ),
    },
    {
      key: "cost",
      header: "비용",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) =>
        row.estimatedCost === null ? (
          <span className="text-text-tertiary">—</span>
        ) : (
          formatMoney(row.estimatedCost, currency)
        ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.instanceId}
      isRowDimmed={(row) => row.state !== "running"}
      caption="서버별 비용"
    />
  );
}
