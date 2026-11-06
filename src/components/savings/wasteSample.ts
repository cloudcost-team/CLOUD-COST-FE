import type { WasteCpuPoint, WasteResponse } from "@/api/waste";

const POINTS_FROM = Date.parse("2026-10-21T15:00:00Z");
const POINT_COUNT = 324;
const HOUR = 3_600_000;

function samplePoints(base: number, peakIndex: number, peak: number) {
  return Array.from({ length: POINT_COUNT }, (_, index): WasteCpuPoint => {
    const wave = ((index * 7) % 11) / 10 + ((index * 3) % 5) / 5;
    const avg = index === peakIndex ? peak : Number((base + wave).toFixed(2));
    return {
      hour: new Date(POINTS_FROM + index * HOUR).toISOString(),
      avg,
      max: Number((avg + 0.8).toFixed(2)),
    };
  });
}

const freshness = {
  instancesRefreshedAt: "2026-11-04T02:00:00Z",
  instancesFromCache: false,
  usageRefreshedAt: "2026-11-04T02:00:00Z",
  usageFromCache: false,
  nextUsageRefreshAt: "2026-11-04T03:00:00Z",
  warnings: [],
};

export const wasteSample: WasteResponse = {
  dataSource: "aws",
  costBasis: "estimated_on_demand",
  currency: "KRW",
  exchangeRate: null,
  status: "OK",
  availableAt: null,
  window: { from: "2026-10-21T02:00:00Z", to: "2026-11-04T02:00:00Z" },
  sort: "SAVINGS",
  type: null,
  totalMonthlySavings: 132000,
  forecastMonthEndCost: 312000,
  savingsRateOfForecast: 42,
  findingCount: 3,
  counts: { oversized: 2, idle: 1 },
  judgedCount: 5,
  items: [
    {
      recommendationId: "i-0abc:OVERSIZED",
      instanceId: "i-0abc",
      name: "api-server",
      instanceType: "m5.large",
      state: "running",
      kind: "OVERSIZED",
      kindLabel: "과다 사양",
      evidence: "최근 14일 CPU 평균 6% (P95 9%)",
      action: "m5.large → t3.medium 으로 변경 검토",
      reason:
        "바꿔도 P95 9%가 t3.medium 기본 성능 20% 안 · 같은 2 vCPU 중 가장 저렴",
      memoryCheckNeeded: true,
      summary: [
        {
          title: "거의 안 쓰고 있어요",
          detail: "14일 평균 CPU 6%, 가장 높을 때도 23%예요",
        },
        {
          title: "줄여도 넉넉해요",
          detail: "바꿔도 예상 사용률 9%, 기본 성능(20%) 안이에요",
        },
        {
          title: "조건을 만족하는 것 중 가장 싸요",
          detail: "시간당 ₩72.1 (다음 후보 t3.large ₩144.2)",
        },
      ],
      summaryNote:
        "메모리(8 → 4 GiB)는 확인하지 못했어요. 바꾸기 전에 서버에서 직접 확인해 주세요.",
      basis: {
        projectedCpuP95: 9,
        targetBaselinePercent: 20,
        nextCandidate: { instanceType: "t3.large", hourlyCost: 144.2 },
      },
      cpuChart: {
        points: samplePoints(4.8, 182, 23),
        max: 23,
        maxAt: "2026-10-29T05:00:00Z",
        baselinePercent: 20,
        baselineLabel: "t3.medium 기본 성능 20%",
      },
      metrics: {
        cpuAvg: 6.12,
        cpuP95: 9,
        cpuMax: 23,
        networkBytes: 3523215360,
        cpuHours: 336,
      },
      monthlyHours: 730,
      estimatedMonthlyCost: 118300,
      estimatedMonthlySavings: 65700,
      comparison: {
        current: {
          instanceType: "m5.large",
          vcpu: 2,
          memoryGib: 8,
          hourlyCost: 162.1,
          monthlyCostAt730h: 118300,
        },
        recommended: {
          instanceType: "t3.medium",
          vcpu: 2,
          memoryGib: 4,
          hourlyCost: 72.1,
          monthlyCostAt730h: 52600,
        },
      },
      cautions: [
        "메모리 사용률은 CloudWatch 기본 지표에 없어 판단에 넣지 않았어요. 서버 안에서 메모리를 먼저 확인해 주세요.",
        "t3는 CPU 크레딧 방식이라 순간적으로 많이 쓰는 작업이 길면 느려질 수 있어요.",
      ],
      consoleSteps: [
        "EC2 → 인스턴스에서 api-server를 중지해요 (중지하는 동안 서비스가 멈춰요)",
        "작업 → 인스턴스 설정 → 인스턴스 유형 변경에서 t3.medium을 골라요",
        "인스턴스를 다시 시작해요",
      ],
    },
    {
      recommendationId: "i-0def:OVERSIZED",
      instanceId: "i-0def",
      name: "dev-api-server",
      instanceType: "m5.xlarge",
      state: "running",
      kind: "OVERSIZED",
      kindLabel: "과다 사양",
      evidence: "최근 14일 CPU 평균 4% (P95 7%)",
      action: "m5.xlarge → t3.large 로 변경 검토",
      reason:
        "vCPU 4→2로 줄여도 예상 P95 14% (7% × 4÷2) · t3.large 기본 성능 30% 안",
      memoryCheckNeeded: true,
      summary: [
        {
          title: "거의 안 쓰고 있어요",
          detail: "14일 평균 CPU 4%, 가장 높을 때도 18%예요",
        },
        {
          title: "줄여도 넉넉해요",
          detail: "바꿔도 예상 사용률 14%, 기본 성능(30%) 안이에요",
        },
        {
          title: "조건을 만족하는 것 중 가장 싸요",
          detail: "시간당 ₩258.1 (다음 후보 t3.xlarge ₩288.4)",
        },
      ],
      summaryNote:
        "메모리(16 → 8 GiB)는 확인하지 못했어요. 바꾸기 전에 서버에서 직접 확인해 주세요.",
      basis: {
        projectedCpuP95: 14,
        targetBaselinePercent: 30,
        nextCandidate: { instanceType: "t3.xlarge", hourlyCost: 288.4 },
      },
      cpuChart: {
        points: samplePoints(3, 120, 18),
        max: 18,
        maxAt: "2026-10-26T15:00:00Z",
        baselinePercent: 30,
        baselineLabel: "t3.large 기본 성능 30%",
      },
      metrics: {
        cpuAvg: 4.05,
        cpuP95: 7,
        cpuMax: 18,
        networkBytes: 1288490188,
        cpuHours: 336,
      },
      monthlyHours: 730,
      estimatedMonthlyCost: 236600,
      estimatedMonthlySavings: 48200,
      comparison: {
        current: {
          instanceType: "m5.xlarge",
          vcpu: 4,
          memoryGib: 16,
          hourlyCost: 324.1,
          monthlyCostAt730h: 236600,
        },
        recommended: {
          instanceType: "t3.large",
          vcpu: 2,
          memoryGib: 8,
          hourlyCost: 258.1,
          monthlyCostAt730h: 188400,
        },
      },
      cautions: [
        "메모리가 16GiB → 8GiB로 줄어요. 메모리 사용률은 CloudWatch 기본 지표에 없어 직접 확인이 필요해요.",
        "t3는 CPU 크레딧 방식이라 순간적으로 많이 쓰는 작업이 길면 느려질 수 있어요.",
      ],
      consoleSteps: [
        "EC2 → 인스턴스에서 dev-api-server를 중지해요 (중지하는 동안 서비스가 멈춰요)",
        "작업 → 인스턴스 설정 → 인스턴스 유형 변경에서 t3.large를 골라요",
        "인스턴스를 다시 시작해요",
      ],
    },
    {
      recommendationId: "i-0ghi:IDLE",
      instanceId: "i-0ghi",
      name: "batch-worker",
      instanceType: "t3.small",
      state: "running",
      kind: "IDLE",
      kindLabel: "유휴",
      evidence: "최근 14일 CPU 1% 미만 · 사용 흔적 거의 없음",
      action: "쓰지 않는다면 AWS 콘솔에서 중지 검토",
      reason:
        "14일간 CPU 최대 3% · 네트워크 하루 2MB 미만 → 쓰지 않는 서버로 판단",
      memoryCheckNeeded: false,
      summary: [
        {
          title: "사실상 쉬고 있어요",
          detail: "14일 동안 CPU가 가장 높을 때도 3%예요",
        },
        { title: "네트워크도 조용해요", detail: "하루 평균 입출력이 2MB예요" },
        {
          title: "중지하면 그만큼 줄어요",
          detail: "매달 ₩ 18,100을 아낄 수 있어요",
        },
      ],
      summaryNote: null,
      basis: null,
      cpuChart: {
        points: samplePoints(0.2, 60, 3),
        max: 3,
        maxAt: "2026-10-24T03:00:00Z",
        baselinePercent: null,
        baselineLabel: null,
      },
      metrics: {
        cpuAvg: 0.6,
        cpuP95: 1.4,
        cpuMax: 3,
        networkBytes: 29360128,
        cpuHours: 336,
      },
      monthlyHours: 730,
      estimatedMonthlyCost: 18100,
      estimatedMonthlySavings: 18100,
      comparison: {
        current: {
          instanceType: "t3.small",
          vcpu: 2,
          memoryGib: 2,
          hourlyCost: 24.8,
          monthlyCostAt730h: 18100,
        },
        recommended: null,
      },
      cautions: [
        "배치처럼 가끔만 도는 작업이 있는지 먼저 확인해 주세요. 14일 안에 한 번도 돌지 않았을 수 있어요.",
      ],
      consoleSteps: [
        "EC2 → 인스턴스에서 batch-worker를 골라요",
        "인스턴스 상태 → 인스턴스 중지를 눌러요",
        "다시 쓸 일이 없으면 스냅샷을 남긴 뒤 정리를 검토해요",
      ],
    },
  ],
  skipped: [],
  freshness,
  notes: [
    "미연결 볼륨 · 미사용 고정 IP · 스냅샷 · 로드밸런서는 지금 연결 권한으로는 찾을 수 없어요.",
  ],
  asOf: "2026-11-04T02:00:00Z",
};
