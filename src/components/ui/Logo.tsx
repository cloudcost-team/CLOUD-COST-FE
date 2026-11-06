import Image from "next/image";
import appIcon from "@/assets/app-icon.svg";
import appIconFace from "@/assets/app-icon-face.svg";
import { cn } from "@/lib/cn";

type BrandIcon = "default" | "face";

type LogoProps = {
  brandIcon?: BrandIcon;
  className?: string;
};

export function Logo({ brandIcon = "default", className }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-gap-small", className)}>
      <Image
        src={brandIcon === "face" ? appIconFace : appIcon}
        alt=""
        width={32}
        height={32}
      />
      <span className="text-title-small font-extrabold text-text-strong">
        CloudCost
      </span>
    </div>
  );
}
