
import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export default function Image({
  src,
  alt,
  fill = false,
  priority = false,
  sizes: _sizes,
  className,
  loading,
  ...props
}: ImageProps) {
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      loading={priority ? "eager" : loading ?? "lazy"}
      className={[
        fill ? "absolute inset-0 h-full w-full" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
