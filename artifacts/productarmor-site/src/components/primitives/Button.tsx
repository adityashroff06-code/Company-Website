import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "light";

interface ButtonBase {
  /** `primary` — the brand action; `outline` — hairline on the current text colour; `light` — white, for dark chapters and footage. */
  variant?: ButtonVariant;
  className?: string;
  children?: ReactNode;
}

export interface ButtonLinkProps
  extends ButtonBase,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children"> {
  /** An in-app path renders a wouter <Link>; http(s):, mailto:, tel: and # render a plain <a>. */
  href: string;
}

export interface ButtonButtonProps
  extends ButtonBase,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

export type ButtonProps = ButtonLinkProps | ButtonButtonProps;

const VARIANT: Record<ButtonVariant, string> = {
  primary: "pa-button-primary",
  outline: "pa-button-outline",
  light: "pa-button-light",
};

const EXTERNAL = /^(https?:|mailto:|tel:|#)/;

/**
 * The action primitive (brief §6, design-system §7): 48px target, --pa-radius-md, a visible
 * focus ring on --ring. Replaces .btn-primary / .btn-outline / .btn-light.
 */
export function Button(props: ButtonProps) {
  const classes = cn("pa-button", VARIANT[props.variant ?? "primary"], props.className);

  if (props.href !== undefined) {
    const { variant: _variant, className: _className, href, children, ...anchor } = props;
    if (EXTERNAL.test(href)) {
      const external = /^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
      return (
        <a href={href} className={classes} {...external} {...anchor}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {children}
      </Link>
    );
  }

  const { variant: _variant, className: _className, href: _href, type = "button", children, ...button } = props;
  return (
    <button type={type} className={classes} {...button}>
      {children}
    </button>
  );
}
