import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) : React.JSX.Element => {
  return (
    <div className="bg-white rounded-xl border-2 border-accent-light shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-6 bg-linear-to-l from-bg-cream to-accent-light border-b-2 border-accent-light text-center">
        <h1 className="text-2xl text-text-dark mb-2 font-bold">{title}</h1>
        <p className="text-text-muted text-base">{subtitle}</p>
      </div>

      {/* Card Content */}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};