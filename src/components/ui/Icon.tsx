import { cn } from "@/lib/cn";
import { iconPaths, type IconName, type IconPath } from "./iconPaths";

type IconProps = {
  name: IconName;
  size?: 16 | 20;
  className?: string;
};

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      aria-hidden
      focusable="false"
      className={cn("shrink-0", className)}
    >
      {iconPaths[name].map((path: IconPath) => (
        <path
          key={path.d}
          d={path.d}
          strokeWidth={path.strokeWidth}
          strokeLinecap={path.linecap}
          strokeLinejoin={path.linejoin}
        />
      ))}
    </svg>
  );
}
