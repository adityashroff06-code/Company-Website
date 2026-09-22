import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "li" | "section" | "figure";
  /** Lifts on hover: translateY(-2px) + --shadow-lift over --dur-base; contained media scales 1.02. */
  interactive?: boolean;
  /** Body padding. */
  padding?: "none" | "md" | "lg";
  /** Media rendered flush at the top, clipped to the radius; the body keeps its padding below it. */
  media?: ReactNode;
  children?: ReactNode;
}

const PADDING = { none: "", md: "p-6 sm:p-7", lg: "p-8 sm:p-10" } as const;

/**
 * The borderless card (brief §4.3): --card (surface-1 on light, ink-800 on a gallery chapter)
 * against the chapter background, depth from --shadow-card alone. Replaces .card-standard.
 */
export function Surface({
  as: Tag = "div",
  interactive = false,
  padding = "md",
  media,
  className,
  children,
  ...rest
}: SurfaceProps) {
  const hasMedia = media !== undefined && media !== null;
  return (
    <Tag
      className={cn(
        "pa-surface",
        interactive && "pa-surface-interactive",
        hasMedia ? "pa-surface-has-media" : PADDING[padding],
        className,
      )}
      {...rest}
    >
      {hasMedia && <div className="pa-surface-media">{media}</div>}
      {hasMedia ? <div className={cn("flex flex-1 flex-col", PADDING[padding])}>{children}</div> : children}
    </Tag>
  );
}
