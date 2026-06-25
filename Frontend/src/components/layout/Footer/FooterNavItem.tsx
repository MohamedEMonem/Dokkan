import { Link } from "react-router-dom";

export interface FooterNavItemProps {
  label: string;
  href: string;
  route?: boolean;
}

export default function FooterNavItem({ label, href, route }: FooterNavItemProps) {
  const cls =
    "text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap";
  return (
    <li>
      {route ? (
        <Link className={cls} to={href}>
          {label}
        </Link>
      ) : (
        <a className={cls} href={href}>
          {label}
        </a>
      )}
    </li>
  );
}
