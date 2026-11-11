import { timingSafeEqual } from "node:crypto";
import {
  type SentryWebhookPayload,
  toDiscordMessage,
} from "@/lib/sentryDiscordMessage";

function hasValidToken(request: Request) {
  const expected = process.env.SENTRY_ALERT_TOKEN;
  const actual = new URL(request.url).searchParams.get("token");
  if (!expected || !actual) return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!hasValidToken(request)) return new Response(null, { status: 401 });

  const webhookUrl = process.env.DISCORD_SENTRY_WEBHOOK_URL;
  if (!webhookUrl) return new Response(null, { status: 503 });

  const payload = (await request.json()) as SentryWebhookPayload;
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toDiscordMessage(payload)),
  });

  return new Response(null, { status: response.ok ? 204 : 502 });
}
