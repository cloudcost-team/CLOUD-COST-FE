import * as Sentry from "@sentry/nextjs";
import { scrubSensitive } from "@/lib/scrubSensitive";
import { sentryBaseOptions } from "@/lib/sentryOptions";

export function register() {
  Sentry.init({ ...sentryBaseOptions, beforeSend: scrubSensitive });
}

export const onRequestError = Sentry.captureRequestError;
