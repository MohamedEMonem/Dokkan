import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface DashboardCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function DashboardCard({
  title,
  icon,
  headerAction,
  className,
  children,
  ...rest
}: DashboardCardProps) {
  return (
    <div
      className={clsx(
        "w-full bg-white text-text-dark flex flex-col gap-6 rounded-xl border-2 border-accent-light shadow-lg overflow-hidden transition-all",
        className,
      )}
      {...rest}
    >
      <div className="p-6 border-b-2 border-accent-light bg-linear-to-l from-bg-cream to-white">
        <div className="flex items-center justify-between gap-4">
          <h4 className="leading-none flex items-center gap-2 text-text-dark font-bold text-lg m-0">
            {icon}
            {title}
          </h4>
          {headerAction && (
            <div className="flex items-center gap-2 min-w-0">
              {headerAction}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
