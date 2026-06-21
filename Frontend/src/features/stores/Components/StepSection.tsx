import { type ReactNode } from "react";

interface StepSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function StepSection({
  title,
  description,
  children,
}: StepSectionProps) {
  return (
    <section className="space-y-4">
      {(title || description) && (
        <div>
          {title && <h2 className="text-lg text-text-dark font-semibold">{title}</h2>}
          {description && (
            <p className="text-sm text-text-muted mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
