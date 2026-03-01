import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────── */
const variantClasses = {
  // ── Semantic hierarchy ─────────────────────────────────
  /** Solid teal fill — most prominent CTA */
  primary: "bg-primary hover:bg-primary-dark text-white",
  /** Teal outline — second-level action */
  secondary:
    "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
  /** Ghost / subtle — lowest-emphasis action */
  tertiary: "text-primary hover:bg-primary/10",

  // ── Accent (Gold) ──────────────────────────────────────
  /** Solid gold fill — e.g. featured / premium action */
  accent: "bg-accent hover:bg-accent-dark text-white",
  /** Gold outline — e.g. seller CTA */
  "outline-accent":
    "border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white",

  // ── Special contexts ───────────────────────────────────
  /** White bg, teal text — for use on dark/gradient hero sections */
  hero: "bg-white text-primary hover:bg-accent-light",
  /** Glass effect — for use on dark/image backgrounds */
  "outline-white":
    "border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary",
} as const;

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 " +
  "cursor-pointer";

const sizeClasses = {
  xs: "h-8 min-w-16 px-3 text-xs rounded-lg gap-1.5",
  sm: "h-9 min-w-20 px-4 py-2 text-sm rounded-md gap-2",
  md: "h-10 min-w-24 px-4 py-2 text-base rounded-xl gap-2",
  lg: "h-12 min-w-28 px-6 py-3 text-lg rounded-xl gap-2",
  xl: "h-14 min-w-32 px-8 py-4 text-xl rounded-xl gap-2",
  icon: "h-10 w-10 rounded-full p-0 flex items-center justify-center",
} as const;

/* ────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────── */
export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
