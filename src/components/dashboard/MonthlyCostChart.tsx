"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyCost } from "./DashboardScreen";

type MonthlyCostChartProps = {
  months: MonthlyCost[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
};

export function MonthlyCostChart({
  months,
  selectedMonth,
  onSelectMonth,
}: MonthlyCostChartProps) {
  return (
    <div
      role="img"
      aria-label={`최근 ${months.length}개월 월별 추정 비용 막대 차트, ${Number(selectedMonth.slice(5))}월 선택됨`}
      className="h-48 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={months} accessibilityLayer={false}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickFormatter={(month: string) => `${Number(month.slice(5))}월`}
            tick={{ fill: "var(--color-text-quaternary)", fontSize: 12 }}
          />
          <YAxis hide />
          <Bar
            dataKey="estimatedCost"
            minPointSize={4}
            radius={[4, 4, 0, 0]}
            onClick={(month) =>
              onSelectMonth((month as unknown as MonthlyCost).month)
            }
          >
            {months.map((month) => (
              <Cell
                key={month.month}
                fill={
                  month.month === selectedMonth
                    ? "var(--color-fill-brand)"
                    : month.estimatedCost
                      ? "var(--color-fill-brand-weak)"
                      : "var(--color-fill-neutral-weak)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
