import type { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

/* ────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────── */

const containerClasses =
  "w-full h-9 border-2 border-accent-light rounded-xl px-3 py-1 bg-bg-cream " +
  "flex items-center gap-2 " +
  "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 " +
  "transition-[color,box-shadow] " +
  "has-[:disabled]:pointer-events-none";

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
  isRequired?: boolean;
  error?: string;
}

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export function Input({
  label,
  icon,
  className,
  id,
  isRequired,
  error,
  ...rest
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-dark">
          {label}
          {isRequired && <span className="text-red-500 font-bold mr-1">*</span>}
        </label>
      )}
      <div
        className={clsx(
          containerClasses,
          error && "border-red-500! focus-within:border-red-500! focus-within:ring-red-500/30!",
          className
        )}
      >
        {icon && (
          <span className="flex items-center text-text-muted shrink-0">
            {icon}
          </span>
        )}
        <input id={id} className={inputClasses} {...rest} />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
