import { sendGAEvent } from "@next/third-parties/google";

type AnalyticsEvents = {
  login: { method: "google" };
  demo_start: Record<string, never>;
  aws_connect_start: Record<string, never>;
  aws_connect_success: Record<string, never>;
  aws_connect_fail: { reason: string };
  alert_channel_register: Record<string, never>;
  permission_upgrade_click: { method: "STACK" | "MANUAL_ROLE" };
};

export function trackEvent<Name extends keyof AnalyticsEvents>(
  name: Name,
  ...[params]: AnalyticsEvents[Name] extends Record<string, never>
    ? []
    : [AnalyticsEvents[Name]]
) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  sendGAEvent("event", name, params ?? {});
}
