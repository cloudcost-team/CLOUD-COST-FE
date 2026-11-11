export type SentryIssueWebhook = {
  action?: string;
  data?: {
    issue?: {
      title?: string;
      culprit?: string;
      level?: string;
      shortId?: string;
      web_url?: string;
      project?: { name?: string; slug?: string };
    };
  };
};

const LEVEL_COLORS: Record<string, number> = {
  fatal: 0xed4245,
  error: 0xed4245,
  warning: 0xfee75c,
};
const DEFAULT_COLOR = 0x5865f2;
const MAX_TITLE_LENGTH = 200;

export function toDiscordMessage(payload: SentryIssueWebhook) {
  const issue = payload.data?.issue ?? {};
  const title = issue.title || "제목 없는 에러";
  const level = issue.level ?? "error";

  return {
    content: "🚨 **[FE] Sentry에 새 에러가 들어왔어요**",
    embeds: [
      {
        title: title.slice(0, MAX_TITLE_LENGTH),
        url: issue.web_url,
        color: LEVEL_COLORS[level] ?? DEFAULT_COLOR,
        fields: [
          { name: "이슈", value: issue.shortId || "-", inline: true },
          { name: "레벨", value: level, inline: true },
          { name: "위치", value: issue.culprit || "-", inline: false },
        ],
        footer: {
          text: issue.project?.slug ?? issue.project?.name ?? "cloud-cost-fe",
        },
      },
    ],
  };
}
