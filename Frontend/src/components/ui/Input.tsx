import type { InputHTMLAttributes, ReactNode } from "react";

/* ────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────── */

const containerClasses =
  "w-full h-9 border-2 border-accent-light rounded-xl px-3 py-1 bg-bg-cream " +
  "flex items-center gap-2 " +
  "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 " +
  "transition-[color,box-shadow] " +
  "has-[:disabled]:pointer-events-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50";

const inputClasses =
  "flex-1 bg-transparent border-none outline-none p-0 " +
  "text-base text-text-dark font-[inherit] " +
  "placeholder:text-text-muted";

/* ────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────── */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export function Input({ label, icon, className, id, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-dark">
          {label}
        </label>
      )}
      <div className={[containerClasses, className].join(" ")}>
        {icon && (
          <span className="flex items-center text-text-muted shrink-0">
            {icon}
          </span>
        )}
        <input id={id} className={inputClasses} {...rest} />
      </div>
    </div>
  );
}
