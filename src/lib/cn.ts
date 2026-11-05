import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const fontSizes = [
  "display-large",
  "display-medium",
  "display-small",
  "title-large",
  "title-medium",
  "title-small",
  "title-small-weak",
  "title-small-xweak",
  "title-xsmall",
  "title-xsmall-weak",
  "title-xsmall-xweak",
  "body-large",
  "body-medium",
  "body-medium-strong",
  "body-xsmall",
  "subtext-large",
  "subtext-medium",
  "subtext-medium-strong",
  "subtext-small",
  "label-large",
  "label-medium",
  "label-medium-strong",
  "label-medium-weak",
  "label-small",
  "label-small-strong",
  "label-small-weak",
  "label-xsmall",
  "label-xsmall-weak",
];

const spacing = [
  ...["xxsmall", "xsmall", "small", "medium", "large", "xlarge", "xxlarge"].map(
    (s) => `padding-${s}`,
  ),
  ...["xxsmall", "xsmall", "small", "medium", "large", "xlarge"].map(
    (s) => `gap-${s}`,
  ),
  ...[
    "xsmall",
    "small",
    "medium",
    "large",
    "xlarge",
    "xxlarge",
    "xxxlarge",
  ].map((s) => `spacing-${s}`),
  "margin-screen-compact",
  "margin-screen",
  "margin-screen-wide",
  "margin-section",
];

const radius = [
  "xsmall",
  "small",
  "medium",
  "large",
  "xlarge",
  "xxlarge",
  "xxxlarge",
];

const shadows = ["weak", "default", "strong"];

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: fontSizes,
      spacing,
      radius,
      shadow: shadows,
      animate: ["dot-pulse"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
