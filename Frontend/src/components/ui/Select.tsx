import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

/* ────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────── */
const baseClasses =
  "w-full h-12 border-2 border-accent-light rounded-xl px-5 text-base text-text-dark bg-white font-[inherit] " +
  "outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 " +
  "transition-[color,box-shadow] appearance-none pl-10 " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

/* ────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────── */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  isRequired?: boolean;
  error?: string;
}

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export function Select({
  label,
  options,
  placeholder,
  className,
  id,
  isRequired,
  error,
  ...rest
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-dark">
          {label}
          {isRequired && <span className="text-red-500 font-bold mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={clsx(
            baseClasses,
            error && "border-red-500! focus:border-red-500! focus:ring-red-500/30!",
            className
          )}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
          <ChevronDown size={16} color="black" strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
