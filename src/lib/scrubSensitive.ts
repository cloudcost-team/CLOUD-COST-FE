const ARN_PATTERN = /arn:aws[\w-]*:[^\s"'<>]*/g;
const ACCOUNT_ID_PATTERN = /\b\d{12}\b/g;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function scrubSensitive<T>(value: T): T {
  if (typeof value === "string")
    return value
      .replace(ARN_PATTERN, "[ARN]")
      .replace(ACCOUNT_ID_PATTERN, "[ACCOUNT_ID]") as T;
  if (Array.isArray(value)) return value.map(scrubSensitive) as T;
  if (isPlainObject(value))
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, scrubSensitive(item)]),
    ) as T;
  return value;
}
