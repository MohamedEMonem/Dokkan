import { type ReactNode } from "react";

interface StepSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function StepSection({
  title,
  description,
  children,
}: StepSectionProps) {
  return (
    <section className="rounded-2xl border border-accent-light/60 bg-bg-cream/50 p-5 md:p-6 space-y-4">
      <div>
        <h2 className="text-lg text-text-dark font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-text-muted mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
