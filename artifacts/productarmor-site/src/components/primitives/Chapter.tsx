import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ChapterTheme = "light" | "gallery";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** `content` = --measure-content (1240px); `media` = --measure-media (1440px). */
  width?: "content" | "media";
}

/** Centred measure with the fluid --gutter. Replaces .container-width page by page. */
export function Container({ width = "content", className, ...rest }: ContainerProps) {
  return <div className={cn("pa-container", width === "media" && "pa-container-media", className)} {...rest} />;
}

export interface ChapterProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "header" | "footer" | "article";
  /** `light` — the white specification chapter; `gallery` — the near-black `.dark` scope. */
  theme?: ChapterTheme;
  /** Inner measure; `bleed` renders children edge to edge. */
  width?: "content" | "media" | "bleed";
  children?: ReactNode;
}

/**
 * A chapter is a section whose theme marks a narrative beat, never a stripe (design-system §1).
 * `gallery` sets the `.dark` scope, so every semantic token inside flips without per-component
 * overrides (§3.4); a page gets at most three flips. Vertical rhythm is --space-chapter, which
 * replaces .section-pad.
 */
export function Chapter({
  as: Tag = "section",
  theme = "light",
  width = "content",
  className,
  children,
  ...rest
}: ChapterProps) {
  return (
    <Tag data-theme={theme} className={cn("pa-chapter", theme === "gallery" && "dark", className)} {...rest}>
      {width === "bleed" ? children : <Container width={width}>{children}</Container>}
    </Tag>
  );
}
