"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getDemoCatalog,
  type DemoOs,
  type DemoSchedule,
  type DemoSetupRequest,
} from "@/api/demo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { Icon } from "@/components/ui/Icon";
import { NumberInput } from "@/components/ui/NumberInput";
import { formatKstDate } from "@/lib/kstDate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type ServerRow = DemoSetupRequest["servers"][number] & { id: string };

const selectClass =
  "h-8 w-full rounded-medium border border-border-default bg-background-default px-3 text-subtext-small text-text-primary outline-none focus:border-border-brand";

const defaultInstanceTypes = [
  "t3.micro",
  "t3.small",
  "t3.medium",
  "t3.large",
  "m5.large",
  "m5.xlarge",
  "c5.large",
  "c5.xlarge",
  "r5.large",
  "g4dn.xlarge",
];

const defaultSchedules: Array<{ code: DemoSchedule; label: string }> = [
  { code: "ALWAYS", label: "24시간" },
  { code: "WEEKDAY_OFFICE", label: "평일 09~19시" },
  { code: "DAILY_HOURS", label: "매일 8시간" },
];

const initialServers: ServerRow[] = [
  {
    id: "web",
    name: "web-server",
    instanceType: "t3.medium",
    os: "LINUX",
    count: 2,
    schedule: "ALWAYS",
  },
  {
    id: "batch",
    name: "batch-worker",
    instanceType: "c5.large",
    os: "LINUX",
    count: 1,
    schedule: "WEEKDAY_OFFICE",
  },
  {
    id: "win",
    name: "win-dev",
    instanceType: "t3.large",
    os: "WINDOWS",
    count: 1,
    schedule: "DAILY_HOURS",
    hoursPerDay: 8,
  },
];

function defaultDates() {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 90);
  return { from: formatKstDate(from), to: formatKstDate(to) };
}

export function DemoSetupScreen() {
  const router = useRouter();
  const dates = defaultDates();
  const [from, setFrom] = useState(dates.from);
  const [to, setTo] = useState(dates.to);
  const [servers, setServers] = useState(initialServers);
  const catalog = useQuery({
    queryKey: ["demo", "catalog"],
    queryFn: getDemoCatalog,
  });

  useEffect(() => {
    if (!sessionStorage.getItem("cloudcost.demoAccount"))
      router.replace("/demo/login");
  }, [router]);

  function updateServer(id: string, patch: Partial<ServerRow>) {
    setServers((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const request: DemoSetupRequest = {
      from,
      to,
      servers: servers.map((server) => ({
        name: server.name,
        instanceType: server.instanceType,
        os: server.os,
        count: server.count,
        schedule: server.schedule,
        hoursPerDay: server.hoursPerDay,
        usagePattern: server.usagePattern,
      })),
    };
    sessionStorage.setItem("cloudcost.demoSetup", JSON.stringify(request));
    router.push("/demo/dashboard");
  }

  const instanceTypes =
    catalog.data?.instanceTypes.map((type) => type.instanceType) ??
    defaultInstanceTypes;
  const schedules = catalog.data?.schedules ?? defaultSchedules;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-title-large text-text-strong">
          예시 서버를 구성해 주세요
        </h1>
        <p className="mt-2 text-subtext-medium text-text-tertiary">
          서버 구성과 조회 기간을 정하면 예시 단가로 비용을 계산해 보여 줘요.
        </p>
      </div>
      <form className="flex flex-col gap-6" onSubmit={submit}>
        <Card
          title="서버 구성"
          meta={`${servers.length} / ${catalog.data?.maxServers ?? 20}`}
        >
          <div className="overflow-x-auto rounded-large border border-border-default">
            <table className="w-full min-w-[900px] table-fixed text-left">
              <thead className="bg-fill-neutral-weak text-subtext-small text-text-tertiary">
                <tr>
                  {["이름", "인스턴스 타입", "OS", "실행 일정", "대수", ""].map(
                    (label) => (
                      <th key={label} className="px-4 py-3 font-normal">
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {servers.map((server) => (
                  <tr
                    key={server.id}
                    className="border-t border-border-default text-subtext-small"
                  >
                    <td className="p-3">
                      <input
                        aria-label="서버 이름"
                        className={selectClass}
                        value={server.name}
                        onChange={(e) =>
                          updateServer(server.id, { name: e.target.value })
                        }
                        required
                      />
                    </td>
                    <td className="p-3">
                      <Select
                        value={server.instanceType}
                        onValueChange={(instanceType) =>
                          updateServer(server.id, { instanceType })
                        }
                      >
                        <SelectTrigger aria-label="인스턴스 타입">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {instanceTypes.map((instanceType) => (
                            <SelectItem key={instanceType} value={instanceType}>
                              {instanceType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Select
                        value={server.os}
                        onValueChange={(os) =>
                          updateServer(server.id, {
                            os: os as DemoOs,
                          })
                        }
                      >
                        <SelectTrigger aria-label="운영체제">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LINUX">Linux</SelectItem>
                          <SelectItem value="WINDOWS">Windows</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Select
                        value={server.schedule}
                        onValueChange={(value) => {
                          const schedule = value as DemoSchedule;
                          updateServer(server.id, {
                            schedule,
                            hoursPerDay:
                              schedule === "DAILY_HOURS" ? 8 : undefined,
                          });
                        }}
                      >
                        <SelectTrigger aria-label="실행 일정">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {schedules.map((schedule) => (
                            <SelectItem
                              key={schedule.code}
                              value={schedule.code}
                            >
                              {schedule.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <NumberInput
                        aria-label={`${server.name} 서버 대수`}
                        min={1}
                        max={catalog.data?.maxCountPerServer ?? 10}
                        value={server.count}
                        onValueChange={(count) =>
                          updateServer(server.id, {
                            count,
                          })
                        }
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        aria-label={`${server.name} 삭제`}
                        className="text-icon-primary disabled:text-icon-tertiary"
                        disabled={servers.length === 1}
                        onClick={() =>
                          setServers((rows) =>
                            rows.filter((row) => row.id !== server.id),
                          )
                        }
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            variant="secondary"
            size="small"
            icon="plus"
            disabled={servers.length >= (catalog.data?.maxServers ?? 20)}
            onClick={() =>
              setServers((rows) => [
                ...rows,
                {
                  id: crypto.randomUUID(),
                  name: `server-${rows.length + 1}`,
                  instanceType: instanceTypes[0],
                  os: "LINUX",
                  count: 1,
                  schedule: "ALWAYS",
                },
              ])
            }
          >
            서버 추가
          </Button>
        </Card>
        <Card title="조회 기간">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex w-full max-w-[360px] flex-col gap-2 text-subtext-small text-text-secondary">
              시작일
              <DatePicker
                aria-label="조회 시작일"
                value={from}
                max={to}
                onChange={setFrom}
              />
            </label>
            <span className="pb-4 text-text-tertiary">~</span>
            <label className="flex w-full max-w-[360px] flex-col gap-2 text-subtext-small text-text-secondary">
              종료일
              <DatePicker
                aria-label="조회 종료일"
                value={to}
                min={from}
                max={dates.to}
                onChange={setTo}
              />
            </label>
          </div>
          <p className="text-subtext-small text-text-tertiary">
            최대 455일 · 오늘 이후 날짜는 고를 수 없어요.
          </p>
        </Card>
        <Button type="submit" className="self-end">
          예시 비용 보기
        </Button>
      </form>
    </>
  );
}
