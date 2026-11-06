import type { BenchmarkResponse } from "@/api/benchmark";
import type { DistributionBars } from "./DistributionChart";
import type { SpendScale } from "./RangeBar";

export const benchmarkSample: BenchmarkResponse = {
  dataSource: "aws",
  costBasis: "estimated_on_demand",
  currency: "KRW",
  exchangeRate: {
    base: "USD",
    quote: "KRW",
    rate: 1380,
    date: "2026-11-05",
    source: "한국수출입은행",
  },
  accountId: "00000000-0000-0000-0000-000000000001",
  status: "OK",
  availableAt: null,
  window: {
    from: "2026-10-22T15:00:00Z",
    to: "2026-11-05T15:00:00Z",
  },
  appliedRecommendationIds: [
    "i-0abc1111:OVERSIZED",
    "i-0abc2222:OVERSIZED",
    "i-0abc3333:IDLE",
  ],
  oversizedRatio: {
    status: "OK",
    ours: { judgedCount: 5, oversizedCount: 3, ratio: 60 },
    moreEfficientTeamsPercent: 64,
    matchedSizeBand: "3-20",
    reference: {
      source: "Azure Public Dataset V2",
      description:
        "마이크로소프트 내부 서비스 VM 30일 기록 중 같은 VM 대수 구간 구독들의 과다 사양 비율, 참고용",
      sizeBand: "3-20",
      sizeBandLabel: "VM 3~20대",
      dataAvailable: true,
      sampleSize: 2607,
      averageRatio: 42,
      medianRatio: 35,
      percentileAvailable: true,
    },
    sizeBands: [
      {
        key: "1-2",
        label: "서버 1~2대",
        minServers: 1,
        maxServers: 2,
        dataAvailable: true,
        matchesOurs: false,
      },
      {
        key: "3-20",
        label: "서버 3~20대",
        minServers: 3,
        maxServers: 20,
        dataAvailable: true,
        matchesOurs: true,
      },
    ],
    servers: [
      {
        instanceId: "i-0abc1111",
        name: "api-server",
        instanceType: "m5.large",
        cpuP95: 9,
        cpuHours: 336,
        oversized: true,
        verdict: "과다 사양",
      },
      {
        instanceId: "i-0abc2222",
        name: "dev-api-server",
        instanceType: "m5.large",
        cpuP95: 7,
        cpuHours: 336,
        oversized: true,
        verdict: "과다 사양",
      },
      {
        instanceId: "i-0abc3333",
        name: "batch-worker",
        instanceType: "c5.xlarge",
        cpuP95: 1,
        cpuHours: 336,
        oversized: true,
        verdict: "과다 사양 · 유휴",
      },
      {
        instanceId: "i-0abc4444",
        name: "web-server-1",
        instanceType: "t3.medium",
        cpuP95: 34,
        cpuHours: 336,
        oversized: false,
        verdict: "적정",
      },
      {
        instanceId: "i-0abc5555",
        name: "gpu-test",
        instanceType: "g4dn.xlarge",
        cpuP95: 12,
        cpuHours: 120,
        oversized: false,
        verdict: "적정",
      },
    ],
    afterSimulation: { judgedCount: 4, oversizedCount: 0, ratio: 0 },
  },
  wasteRatio: {
    status: "UNAVAILABLE",
    reason:
      "미연결 볼륨·미사용 IP까지 포함한 금액 기준이라 현재 권한(EC2·CloudWatch)으로는 원안대로 계산할 수 없어요.",
    referenceSource: "Flexera 2026",
    referenceDescription: "클라우드 지출 중 낭비로 추정되는 비율의 업계 평균",
    referenceAverage: 29,
  },
  monthlySpend: {
    status: "OK",
    monthlyCost: 312000,
    position: "WITHIN",
    range: {
      source: "SpendArk 2026",
      description: "1~10명 팀의 월 클라우드 지출 범위",
      min: 138000,
      max: 690000,
      minUsd: 100,
      maxUsd: 500,
    },
    afterSimulation: { monthlyCost: 180000, position: "WITHIN" },
  },
  freshness: {
    instancesRefreshedAt: "2026-11-06T00:00:00Z",
    instancesFromCache: false,
    usageRefreshedAt: "2026-11-06T00:00:00Z",
    usageFromCache: false,
    nextUsageRefreshAt: "2026-11-06T01:00:00Z",
    warnings: [],
  },
  notes: [],
  asOf: "2026-11-06T00:00:00Z",
};

export const benchmarkDistributionSample: DistributionBars = {
  values: [
    64, 48, 54, 72, 88, 84, 78, 64, 54, 44, 40, 30, 26, 22, 18, 16, 14, 12, 10,
    8,
  ],
  oursIndex: 12,
  afterIndex: 0,
};

export const benchmarkSpendScaleSample: SpendScale = {
  rangeStart: 10,
  rangeEnd: 50,
  marker: 22.6,
  afterMarker: 13,
  startLabel: "$0",
  endLabel: "$1,000+",
  oursLabel: "약 $226",
  afterLabel: "약 $130",
};

export const selectedMonthlySavingsSample = 132000;
