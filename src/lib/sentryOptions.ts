import { scrubSensitive } from "./scrubSensitive";

export const sentryBaseOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  beforeSendSpan: scrubSensitive,
  beforeBreadcrumb: scrubSensitive,
};
