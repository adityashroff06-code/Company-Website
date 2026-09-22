import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "h2" | "h3";
  /** `primary` — brand-600 on light, brand-300 on a gallery chapter; `muted` — the caption colour. */
  tone?: "primary" | "muted";
}

/** The wide-tracked uppercase eyebrow: --text-eyebrow (11px / 0.22em / 600) with `uppercase` bundled. */
export function Eyebrow({ as: Tag = "p", tone = "primary", className, ...rest }: EyebrowProps) {
  return (
    <Tag
      className={cn("text-eyebrow uppercase", tone === "primary" ? "text-primary" : "text-muted-foreground", className)}
      {...rest}
    />
  );
}
