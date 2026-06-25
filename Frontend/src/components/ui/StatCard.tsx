import type { ReactNode } from "react";
import { Card } from "./Card";

export interface StatCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  action?: ReactNode;
  className?: string;
  variant?: "glass" | "default";
}

export function StatCard({
  title,
  value,
  icon,
  action,
  className,
  variant = "glass",
}: StatCardProps) {
  const isGlass = variant === "glass";
  return (
    <Card variant={variant} className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {action && <div className="flex items-center">{action}</div>}
        </div>
        <div className={`text-3xl font-semibold mb-1 ${isGlass ? "text-white" : "text-text-dark"}`}>
          {value}
        </div>
        <div className={`text-sm ${isGlass ? "text-white/80" : "text-text-muted"}`}>
          {title}
        </div>
      </div>
    </Card>
  );
}
