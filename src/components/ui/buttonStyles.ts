import type { InteractionOverlayTone } from "./InteractionOverlay";

export type ButtonVariant = "primary" | "secondary" | "assistive" | "danger";
export type ButtonSize = "large" | "medium" | "small";

export const buttonBaseClasses = [
  "group relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap transition-transform",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
  "active:scale-95",
];

export const buttonVariantClasses: Record<
  ButtonVariant,
  {
    container: string;
    icon: string;
    overlay: InteractionOverlayTone;
    dot: string;
  }
> = {
  primary: {
    container: "bg-fill-brand text-text-on-fill",
    icon: "text-icon-on-fill",
    overlay: "onFill",
    dot: "bg-fill-default",
  },
  secondary: {
    container: "bg-fill-brand-weak text-text-brand",
    icon: "text-icon-brand",
    overlay: "brand",
    dot: "bg-fill-brand",
  },
  assistive: {
    container: "bg-fill-neutral-weak text-text-secondary",
    icon: "text-icon-default",
    overlay: "neutral",
    dot: "bg-fill-neutral",
  },
  danger: {
    container: "bg-fill-danger text-text-on-fill",
    icon: "text-icon-on-fill",
    overlay: "onFill",
    dot: "bg-fill-default",
  },
};

export const buttonSizeClasses: Record<
  ButtonSize,
  { container: string; iconSize: 16 | 20; dots: "large" | "small" }
> = {
  large: {
    container: "h-12 rounded-large px-padding-large text-label-small",
    iconSize: 20,
    dots: "large",
  },
  medium: {
    container: "h-10 rounded-medium px-padding-medium text-label-xsmall",
    iconSize: 20,
    dots: "large",
  },
  small: {
    container:
      "h-8 rounded-medium px-padding-small text-label-xsmall before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
    iconSize: 16,
    dots: "small",
  },
};
