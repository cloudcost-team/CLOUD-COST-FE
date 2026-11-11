import * as Sentry from "@sentry/nextjs";
import { ApiError } from "@/api/client";
import { scrubSensitive } from "@/lib/scrubSensitive";
import { sentryBaseOptions } from "@/lib/sentryOptions";

Sentry.init({
  ...sentryBaseOptions,
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error instanceof ApiError && error.status < 500) return null;
    return scrubSensitive(event);
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
