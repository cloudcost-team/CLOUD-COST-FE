import Image from "next/image";
import appIcon from "@/assets/app-icon.svg";
import appIconFace from "@/assets/app-icon-face.svg";

type BrandAppIconProps = {
  /** 얼굴 표시. 60px 이하(탭 아이콘 등 표정이 안 보이는 크기)에서는 false (Figma Brand/AppIcon 지침) */
  face?: boolean;
  /** 한 변 길이(px). Figma 기준 240 */
  size?: number;
  className?: string;
};

export function BrandAppIcon({
  face = true,
  size = 240,
  className,
}: BrandAppIconProps) {
  return (
    <Image
      src={face ? appIconFace : appIcon}
      alt="CloudCost"
      width={size}
      height={size}
      className={className}
    />
  );
}
