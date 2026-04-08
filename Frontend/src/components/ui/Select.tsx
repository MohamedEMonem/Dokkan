import type { SelectHTMLAttributes } from "react";

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
  ...rest
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-dark">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={[baseClasses, className].join(" ")}
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </div>
    </div>
  );
}
