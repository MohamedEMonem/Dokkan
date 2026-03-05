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
  "w-full h-full flex items-center justify-center whitespace-nowrap font-medium transition-all " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 " +
  "cursor-pointer rounded-lg";

/* ────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────── */
export type ButtonVariant = keyof typeof variantClasses;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[baseClasses, variantClasses[variant], className].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
