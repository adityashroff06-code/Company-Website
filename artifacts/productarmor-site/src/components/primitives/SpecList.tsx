import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Spec {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
}

export interface SpecListProps extends Omit<HTMLAttributes<HTMLDListElement>, "children"> {
  items: Spec[];
  columns?: 1 | 2;
  size?: "md" | "sm";
}

/** Hairline-ruled specification rows with tabular numerals (brief §3, §5C). */
export function SpecList({ items, columns = 1, size = "md", className, ...rest }: SpecListProps) {
  return (
    <dl
      className={cn(
        "border-t border-border",
        columns === 2 && "sm:grid sm:grid-cols-2 sm:gap-x-10",
        className,
      )}
      {...rest}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "flex items-baseline justify-between gap-6 border-b border-border",
            size === "sm" ? "py-2.5" : "py-3.5",
          )}
        >
          <dt className="text-caption text-muted-foreground">{item.label}</dt>
          <dd className={cn("text-right tabular-nums text-foreground", size === "sm" ? "text-caption" : "text-body")}>
            {item.value}
            {item.unit !== undefined && item.unit !== null && (
              <span className="ml-1 text-caption text-muted-foreground">{item.unit}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
