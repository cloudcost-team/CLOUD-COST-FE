export type SentryWebhookPayload = {
  project_name?: string;
  level?: string;
  culprit?: string;
  message?: string;
  url?: string;
  event?: {
    title?: string;
    environment?: string;
    tags?: [string, string][];
  };
};

const LEVEL_COLORS: Record<string, number> = {
  fatal: 0xed4245,
  error: 0xed4245,
  warning: 0xfee75c,
};
const DEFAULT_COLOR = 0x5865f2;
const MAX_TITLE_LENGTH = 200;

function findEnvironment(payload: SentryWebhookPayload) {
  return (
    payload.event?.environment ??
    payload.event?.tags?.find(([key]) => key === "environment")?.[1] ??
    "unknown"
  );
}

export function toDiscordMessage(payload: SentryWebhookPayload) {
  const title = payload.event?.title || payload.message || "제목 없는 에러";
  const level = payload.level ?? "error";

  return {
    content: "🚨 **[FE] Sentry에 새 에러가 들어왔어요**",
    embeds: [
      {
        title: title.slice(0, MAX_TITLE_LENGTH),
        url: payload.url,
        color: LEVEL_COLORS[level] ?? DEFAULT_COLOR,
        fields: [
          { name: "환경", value: findEnvironment(payload), inline: true },
          { name: "레벨", value: level, inline: true },
          { name: "위치", value: payload.culprit || "-", inline: false },
        ],
        footer: { text: payload.project_name ?? "cloud-cost-fe" },
      },
    ],
  };
}
