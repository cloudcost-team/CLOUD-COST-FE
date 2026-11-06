import type {
  CostsSummaryResponse,
  DailyCostsWithInstancesResponse,
  DashboardResponse,
  InstancesResponse,
  MonthlyCostsResponse,
} from "@/api/dashboard";

const freshness = {
  instancesRefreshedAt: "2026-11-04T02:20:00Z",
  instancesFromCache: false,
  usageRefreshedAt: "2026-11-04T02:20:00Z",
  usageFromCache: true,
  nextUsageRefreshAt: "2026-11-04T03:20:00Z",
  warnings: [],
};

const instanceRows = [
  {
    instanceId: "i-web",
    name: "web-server-1",
    instanceType: "t3.medium",
    state: "running",
    usageHours: 96,
    estimatedHourlyCost: 69.3,
    estimatedCost: 6900,
    note: null,
  },
  {
    instanceId: "i-api",
    name: "api-server",
    instanceType: "m5.large",
    state: "running",
    usageHours: 96,
    estimatedHourlyCost: 157.3,
    estimatedCost: 15550,
    note: null,
  },
  {
    instanceId: "i-batch",
    name: "batch-worker",
    instanceType: "c5.large",
    state: "stopped",
    usageHours: 40,
    estimatedHourlyCost: 128,
    estimatedCost: 5300,
    note: null,
  },
  {
    instanceId: "i-gpu",
    name: "gpu-test",
    instanceType: "g4dn.xlarge",
    state: "stopped",
    usageHours: 12,
    estimatedHourlyCost: null,
    estimatedCost: null,
    note: "해당 인스턴스의 온디맨드 단가를 조회할 수 없습니다.",
  },
];

const dailyAmounts = [
  5200, 5800, 4900, 5600, 5100, 5500, 9840, 5400, 4700, 5900, 5300, 5000, 5700,
  5500, 4900, 5300, 5900, 6200, 5600, 5100, 4800, 5500, 5800, 5400, 5000, 5300,
  5700, 6100, 5900, 5200,
];

const days = dailyAmounts.map((amount, index) => {
  const day = index + 6;
  const date =
    day <= 31
      ? `2026-10-${String(day).padStart(2, "0")}`
      : `2026-11-${String(day - 31).padStart(2, "0")}`;
  return {
    date,
    usageHours: day === 12 ? 61 : 42,
    estimatedCost: amount,
    instances: instanceRows,
    spike:
      day === 12
        ? {
            ratio: 2.4,
            baseline: 4100,
            baselineDays: 30,
            causeInstanceId: "i-web",
            causeName: "web-server-1",
            message:
              "10/12 비용 급증 · 평소의 2.4배 · web-server-1 사용 시간이 늘었어요",
          }
        : null,
  };
});

export const dashboardKrwSample: DashboardResponse = {
  dataSource: "aws",
  costBasis: "estimated_on_demand",
  currency: "KRW",
  exchangeRate: {
    base: "USD",
    quote: "KRW",
    rate: 1380,
    date: "2026-11-03",
    source: "유럽중앙은행 기준환율",
  },
  timezone: "Asia/Seoul",
  today: "2026-11-04",
  month: "2026-11",
  availableFrom: "2026-08-06",
  monthToDate: {
    from: "2026-11-01",
    to: "2026-11-04",
    usageHours: 1240,
    estimatedCost: 128400,
  },
  instanceCounts: { running: 4, stopped: 2 },
  forecast: {
    monthEndCost: 312000,
    costThroughYesterday: 96300,
    dailyAverage: 7700,
    basisFrom: "2026-10-28",
    basisTo: "2026-11-03",
    basisDays: 7,
    remainingDays: 27,
  },
  budget: {
    amount: 400000,
    enteredAmount: 400000,
    enteredCurrency: "KRW",
    usageRate: 78,
    thresholdReached: null,
  },
  previousMonthSamePeriod: {
    currentFrom: "2026-11-01",
    currentTo: "2026-11-03",
    currentCost: 96300,
    previousFrom: "2026-10-01",
    previousTo: "2026-10-03",
    previousCost: 82500,
    change: 13800,
    changeRate: 12,
  },
  latestSpike: {
    date: "2026-10-12",
    cost: 9840,
    ratio: 2.4,
    baseline: 4100,
    baselineDays: 30,
    causeInstanceId: "i-web",
    causeName: "web-server-1",
    message: "10/12 비용 급증 · 평소의 2.4배",
  },
  freshness,
  notes: [
    "2026-11-03 환율로 환산한 추정치예요 (원 ⇄ 달러는 헤더에서 전환)",
    "사용 시간 × 온디맨드 단가로 계산했어요. RI·Savings Plans·Spot 할인, EBS·데이터 전송 비용은 포함하지 않아요",
    "기록 시작일 2026-08-06 이전 기간은 데이터가 없어요",
    "연결 전에 삭제된 인스턴스는 보이지 않아요",
  ],
  asOf: "2026-11-04T02:20:00Z",
};

export const dashboardUsdSample: DashboardResponse = {
  ...dashboardKrwSample,
  currency: "USD",
  exchangeRate: null,
  monthToDate: { ...dashboardKrwSample.monthToDate, estimatedCost: 93.04 },
  forecast: dashboardKrwSample.forecast && {
    ...dashboardKrwSample.forecast,
    monthEndCost: 226.09,
    costThroughYesterday: 69.78,
    dailyAverage: 5.58,
  },
  budget: {
    amount: 289.86,
    enteredAmount: 400000,
    enteredCurrency: "KRW",
    usageRate: 78,
    thresholdReached: null,
  },
  previousMonthSamePeriod: dashboardKrwSample.previousMonthSamePeriod && {
    ...dashboardKrwSample.previousMonthSamePeriod,
    currentCost: 69.78,
    previousCost: 59.78,
    change: 10,
    changeRate: 12,
  },
  latestSpike: dashboardKrwSample.latestSpike && {
    ...dashboardKrwSample.latestSpike,
    cost: 7.13,
    baseline: 2.97,
  },
};

export const dailyCostsSample: DailyCostsWithInstancesResponse = {
  dataSource: "aws",
  costBasis: "estimated_on_demand",
  currency: "KRW",
  exchangeRate: dashboardKrwSample.exchangeRate,
  freshness,
  notes: [],
  from: days[0].date,
  to: days.at(-1)?.date ?? "2026-11-04",
  availableFrom: "2026-08-06",
  days,
};

export const monthlyCostsSample: MonthlyCostsResponse = {
  dataSource: "aws",
  costBasis: "estimated_on_demand",
  currency: "KRW",
  exchangeRate: dashboardKrwSample.exchangeRate,
  freshness,
  notes: [],
  availableFrom: "2026-08-06",
  months: [
    {
      month: "2025-12",
      usageHours: 0,
      estimatedCost: 0,
      estimatedCostChange: null,
      instances: [],
    },
    {
      month: "2026-01",
      usageHours: 0,
      estimatedCost: 0,
      estimatedCostChange: 0,
      instances: [],
    },
    {
      month: "2026-02",
      usageHours: 0,
      estimatedCost: 0,
      estimatedCostChange: 0,
      instances: [],
    },
    {
      month: "2026-03",
      usageHours: 0,
      estimatedCost: 0,
      estimatedCostChange: 0,
      instances: [],
    },
    {
      month: "2026-04",
      usageHours: 0,
      estimatedCost: 0,
      estimatedCostChange: 0,
      instances: [],
    },
    {
      month: "2026-05",
      usageHours: 0,
      estimatedCost: 0,
      estimatedCostChange: 0,
      instances: [],
    },
    {
      month: "2026-06",
      usageHours: 0,
      estimatedCost: 0,
      estimatedCostChange: 0,
      instances: [],
    },
    {
      month: "2026-07",
      usageHours: 0,
      estimatedCost: 0,
      estimatedCostChange: 0,
      instances: [],
    },
    {
      month: "2026-08",
      usageHours: 700,
      estimatedCost: 57000,
      estimatedCostChange: 57000,
      instances: instanceRows,
    },
    {
      month: "2026-09",
      usageHours: 1120,
      estimatedCost: 108700,
      estimatedCostChange: 51700,
      instances: instanceRows,
    },
    {
      month: "2026-10",
      usageHours: 1380,
      estimatedCost: 114600,
      estimatedCostChange: 8700,
      instances: instanceRows,
    },
    {
      month: "2026-11",
      usageHours: 1240,
      estimatedCost: 62800,
      estimatedCostChange: -51800,
      instances: instanceRows,
    },
  ],
};

export const costsSummarySample: CostsSummaryResponse = {
  dataSource: "aws",
  costBasis: "estimated_on_demand",
  currency: "KRW",
  exchangeRate: dashboardKrwSample.exchangeRate,
  freshness,
  notes: [],
  from: "2026-11-01",
  to: "2026-11-04",
  availableFrom: "2026-08-06",
  usageHours: 1240,
  estimatedCost: 128400,
  instances: instanceRows,
};

export const instancesSample: InstancesResponse = {
  dataSource: "aws",
  costBasis: "estimated_on_demand",
  currency: "KRW",
  exchangeRate: dashboardKrwSample.exchangeRate,
  freshness,
  notes: [],
  instances: instanceRows.map((row) => ({
    instanceId: row.instanceId,
    name: row.name,
    instanceType: row.instanceType,
    region: "ap-northeast-2",
    availabilityZone: "ap-northeast-2a",
    state: row.state,
    launchTime: "2026-08-06T00:00:00Z",
    platformDetails: "Linux/UNIX",
    tenancy: "default",
    spot: false,
    present: true,
    currentRun:
      row.state === "running"
        ? {
            since: "2026-11-01T00:00:00Z",
            hours: row.usageHours,
            note: "현재 실행 구간 기준입니다.",
          }
        : null,
    estimatedHourlyCost: row.estimatedHourlyCost,
    note: row.note,
  })),
};
