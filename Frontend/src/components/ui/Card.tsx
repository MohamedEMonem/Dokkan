import type { HTMLAttributes, ReactNode } from "react";

/* ────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────── */
const variantClasses = {
  default:
    "bg-white rounded-xl border-2 border-accent-light overflow-hidden " +
    "hover:border-accent hover:shadow-lg transition-all",
  glass:
    "bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white overflow-hidden",
};

/* ────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────── */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: keyof typeof variantClasses;
}

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export function Card({ variant = "default", className, children, ...rest }: CardProps) {
  return (
    <div className={[variantClasses[variant], className].join(" ")} {...rest}>
      {children}
    </div>
  );
}
