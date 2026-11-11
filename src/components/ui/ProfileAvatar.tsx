"use client";

import Image from "next/image";
import { useState } from "react";
import defaultProfile from "@/assets/default-profile.svg";
import { cn } from "@/lib/cn";

type ProfileAvatarProps = {
  pictureUrl?: string;
  size: number;
  className?: string;
};

export function ProfileAvatar({
  pictureUrl,
  size,
  className,
}: ProfileAvatarProps) {
  const [failedPictureUrl, setFailedPictureUrl] = useState<string>();
  const usablePictureUrl =
    pictureUrl !== failedPictureUrl ? pictureUrl : undefined;

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-fill-brand-weak",
        className,
      )}
    >
      {usablePictureUrl ? (
        <Image
          src={usablePictureUrl}
          alt=""
          width={size}
          height={size}
          className="size-full object-cover"
          onError={() => setFailedPictureUrl(usablePictureUrl)}
        />
      ) : (
        <Image
          src={defaultProfile}
          alt=""
          width={size}
          height={size}
          className="size-full"
        />
      )}
    </span>
  );
}
