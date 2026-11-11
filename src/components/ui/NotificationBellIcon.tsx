import { cn } from "@/lib/cn";

type NotificationBellIconProps = {
  className?: string;
};

export function NotificationBellIcon({ className }: NotificationBellIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      className={cn("size-8 shrink-0 overflow-visible", className)}
    >
      <path
        d="M24 6C24.7956 6 25.5587 6.31607 26.1213 6.87868C26.6839 7.44129 27 8.20435 27 9V9.6C29.5727 10.2643 31.8522 11.7636 33.481 13.863C35.1098 15.9623 35.9958 18.5429 36 21.2V28L39.2 32.4C40 33.6 39.2 35 37.8 35H10.2C8.8 35 8 33.6 8.8 32.4L12 28V21.2C12.0042 18.5429 12.8902 15.9623 14.519 13.863C16.1478 11.7636 18.4273 10.2643 21 9.6V9C21 8.20435 21.3161 7.44129 21.8787 6.87868C22.4413 6.31607 23.2044 6 24 6Z"
        className="fill-icon-danger"
      />
      <path
        d="M19.6 38H28.4C28.4 39.167 27.9364 40.2861 27.1113 41.1113C26.2861 41.9364 25.167 42.4 24 42.4C22.833 42.4 21.7139 41.9364 20.8887 41.1113C20.0636 40.2861 19.6 39.167 19.6 38Z"
        className="fill-icon-danger"
      />
      <circle
        cx="35.2"
        cy="10.4"
        r="6.5"
        strokeWidth="2"
        className="fill-icon-brand stroke-fill-danger-weak"
      />
    </svg>
  );
}
