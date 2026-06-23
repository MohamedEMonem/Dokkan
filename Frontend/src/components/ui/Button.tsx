import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

/* ────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────── */
const variantClasses = {
  /** Solid teal fill */
  primary: "bg-primary hover:bg-primary-dark text-white",
  /** Teal outline */
  secondary:
    "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
  /** Ghost / subtle  */
  tertiary: "text-primary hover:bg-primary/10",

  // ── Accent (Gold) ──────────────────────────────────────
  /** Solid gold fill */
  accent: "bg-accent hover:bg-accent-dark text-white",
  /** Gold outline  */
  "outline-accent":
    "border border-accent/20 bg-bg-cream/40 text-text-dark hover:bg-accent hover:text-white hover:border-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50",

  /** White bg, teal text */
  hero: "bg-white text-primary hover:bg-accent-light",
  /** Glass effect */
  "outline-white":
    "border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary"

} as const;

const baseClasses =
  "w-full h-full flex gap-2 items-center justify-center whitespace-nowrap font-medium transition-all " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 " +
  "cursor-pointer rounded-lg";

/* ────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────── */
export type ButtonVariant = keyof typeof variantClasses;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconPos?: "left" | "right";
  children?: ReactNode;
}

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export function Button({
  variant = "primary",
  icon,
  iconPos = "right",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...rest}
    >
      {icon && (
        <span
          className={clsx(
            "flex items-center shrink-0",
            iconPos === "left" && "order-last"
          )}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
