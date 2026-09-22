import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MediaRadius = "none" | "md" | "lg" | "xl" | "2xl";

export interface MediaFrameProps extends HTMLAttributes<HTMLElement> {
  /** CSS aspect-ratio such as "16 / 10"; `auto` follows the media's own height. */
  ratio?: string;
  radius?: MediaRadius;
  /** --shadow-media. Turn off inside a Surface, where the surface carries the depth. */
  shadow?: boolean;
  /** Renders a <figure> with this <figcaption> under the frame. */
  caption?: ReactNode;
  children?: ReactNode;
}

const RADIUS: Record<MediaRadius, string> = {
  none: "0",
  md: "var(--pa-radius-md)",
  lg: "var(--pa-radius-lg)",
  xl: "var(--pa-radius-xl)",
  "2xl": "var(--pa-radius-2xl)",
};

/**
 * Photographic media given room to breathe (brief §3): --pa-radius-xl, --shadow-media, media
 * filling the frame with object-fit: cover, a --muted placeholder until it loads.
 */
export function MediaFrame({
  ratio = "auto",
  radius = "xl",
  shadow = true,
  caption,
  className,
  style,
  children,
  ...rest
}: MediaFrameProps) {
  const frameStyle: CSSProperties = {
    aspectRatio: ratio === "auto" ? undefined : ratio,
    borderRadius: RADIUS[radius],
  };
  const frameClass = cn("pa-media-frame", shadow && "pa-media-frame-shadow");

  if (caption === undefined || caption === null) {
    return (
      <div className={cn(frameClass, className)} style={{ ...frameStyle, ...style }} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <figure className={className} style={style} {...rest}>
      <div className={frameClass} style={frameStyle}>
        {children}
      </div>
      <figcaption className="mt-3 text-caption text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
