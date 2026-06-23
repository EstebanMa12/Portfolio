import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { isSupabaseStorageUrl } from "@/lib/utils/image-url";

type TechnologyIconProps = {
  src: string;
  width: number;
  height: number;
  className?: string;
};

export function TechnologyIcon({
  src,
  width,
  height,
  className,
}: Readonly<TechnologyIconProps>) {
  const imageClassName = cn("object-contain", className);

  if (isSupabaseStorageUrl(src)) {
    return (
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className={imageClassName}
      />
    );
  }

  return (
    // External legacy icon URLs are not listed in next/image remotePatterns.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      className={imageClassName}
    />
  );
}
