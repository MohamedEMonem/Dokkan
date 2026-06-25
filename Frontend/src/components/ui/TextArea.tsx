import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

/* ────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────── */
const baseClasses =
  "w-full border-2 border-accent-light rounded-xl px-5 py-4 text-base text-text-dark bg-bg-cream font-[inherit] " +
  "outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 " +
  "placeholder:text-text-muted transition-[color,box-shadow] resize-none " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isRequired?: boolean;
  error?: string;
}

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export function TextArea({
  label,
  className,
  id,
  isRequired,
  error,
  ...rest
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-dark">
          {label}
          {isRequired && <span className="text-red-500 font-bold mr-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        className={clsx(
          baseClasses,
          error && "border-red-500! focus:border-red-500! focus:ring-red-500/30!",
          className
        )}
        {...rest}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
