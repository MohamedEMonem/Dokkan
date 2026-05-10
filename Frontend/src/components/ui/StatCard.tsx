import type { ReactNode } from "react";
import { Card } from "./Card";

export interface StatCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  action,
  className,
}: StatCardProps) {
  return (
    <Card variant="glass" className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {action && <div className="flex items-center">{action}</div>}
        </div>
        <div className="text-3xl font-semibold mb-1">{value}</div>
        <div className="text-white/80 text-sm">{title}</div>
      </div>
    </Card>
  );
}
