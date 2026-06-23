import { Link } from "react-router-dom";
import { SubItem } from "./types";

interface SubNavItemProps extends SubItem {
  className?: string;
  onClick?: () => void;
}

export default function SubNavItem({
  label,
  href,
  className,
  onClick,
}: SubNavItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`w-full h-9 px-4 py-2 text-sm text-text-dark hover:bg-bg-cream hover:text-primary rounded-lg transition-colors ${className ?? ""}`}
    >
      {label}
    </Link>
  );
}
