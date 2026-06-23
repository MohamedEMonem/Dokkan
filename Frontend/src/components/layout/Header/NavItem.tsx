import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { NavItemData } from "./types";
import SubNavItem from "./SubNavItem";

interface NavItemProps {
  item: NavItemData;
}

export default function NavItem({ item }: NavItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <Link
        to={item.href}
        className="flex items-center gap-1 px-3 py-2 text-sm text-text-dark hover:text-primary transition-colors"
      >
        <span>{item.label}</span>
        {item.subItems && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </Link>

      {/* Dropdown */}
      {item.subItems && open && (
        <div className="absolute right-0 pt-2 pb-2 z-50">
          <div className="w-48 bg-white border justify-center border-accent-light rounded-xl shadow-lg p-3 flex flex-col gap-1">
            {item.subItems.map((sub) => (
              <SubNavItem key={sub.href} label={sub.label} href={sub.href} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
