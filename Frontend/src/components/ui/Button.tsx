import type { ButtonHTMLAttributes, ReactNode } from "react";

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
    "border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white",

  /** White bg, teal text */
  hero: "bg-white text-primary hover:bg-accent-light",
  /** Glass effect */
  "outline-white":
    "border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary"

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
