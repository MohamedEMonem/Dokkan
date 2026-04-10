import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Menu,
  Search,
  Store,
  ChevronDown,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/Input";

// ─── Types ───────────────────────────────────────────────────────────────────
interface SubItem {
  label: string;
  href: string;
}

interface NavItemData {
  label: string;
  href: string;
  subItems?: SubItem[];
}

// ─── Nav Data ────────────────────────────────────────────────────────────────
const navItems: NavItemData[] = [
  {
    label: "المنتجات",
    href: "/products",
    subItems: [
      { label: "الإلكترونيات", href: "/products?cat=electronics" },
      { label: "الموضة والأزياء", href: "/products?cat=fashion" },
      { label: "المنزل والمعيشة", href: "/products?cat=home" },
      { label: "مستحضرات التجميل", href: "/products?cat=beauty" },
      { label: "الرياضة", href: "/products?cat=sports" },
      { label: "الكتب", href: "/products?cat=books" },
    ],
  },
  {
    label: "المحلات",
    href: "/marketplace",
    subItems: [
      { label: "أفضل المتاجر", href: "/marketplace?sort=top" },
      { label: "المتاجر الجديدة", href: "/marketplace?sort=new" },
      { label: "متاجر موثوقة", href: "/marketplace?filter=verified" },
    ],
  },
];

const iconActions = [
  {
    icon: <Heart className="w-5 h-5 text-text-dark" />,
    href: "/favorites",
    ariaLabel: "المفضلة",
  },
  {
    icon: <ShoppingCart className="w-5 h-5 text-text-dark" />,
    href: "/cart",
    ariaLabel: "سلة التسوق",
  },
  {
    icon: <User className="w-5 h-5 text-text-dark" />,
    href: "/login",
    ariaLabel: "حسابي",
  },
];

// ─── SubNavItem ──────────────────────────────────────────────────────────────
function SubNavItem({ label, href }: SubItem) {
  return (
    <a
      href={href}
      className="px-4 py-2 text-sm text-text-dark hover:bg-bg-cream hover:text-primary rounded-lg transition-colors"
    >
      {label}
    </a>
  );
}

// ─── NavItem with dropdown ────────────────────────────────────────────────────
function NavItem({ item }: { item: NavItemData }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <a
        href={item.href}
        className="flex items-center gap-1 px-3 py-2 text-sm text-text-dark hover:text-primary transition-colors"
      >
        <span>{item.label}</span>
        {item.subItems && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </a>

      {/* Dropdown */}
      {item.subItems && open && (
        <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-accent-light rounded-xl shadow-lg p-3 flex flex-col gap-2 z-50">
          {item.subItems.map((sub, i) => (
            <SubNavItem key={i} label={sub.label} href={sub.href} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
export default function Header() {
  return (
    <header
      className="sticky top-0 z-60 bg-white border-b shadow-sm"
      dir="rtl"
    >
      <div className="container mx-auto ps-8 pe-4 md:ps-12 md:pe-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-primary">دكان</span>
          </a>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item, idx) => (
              <NavItem key={idx} item={item} />
            ))}
          </nav>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-2xl mx-auto">
            <div className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ابحث عن منتج أو متجر..."
                  icon={<Search className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>
          </div>

          {/* Icon actions */}
          <div className="flex items-center gap-4">
            {iconActions.map((action, idx) => (
              <a
                key={idx}
                href={action.href}
                className="relative"
                aria-label={action.ariaLabel}
              >
                <button className="inline-flex items-center justify-center size-9 rounded-md hover:bg-accent-light transition-colors cursor-pointer">
                  {action.icon}
                </button>
              </a>
            ))}

            {/* Mobile menu toggle */}
            <button
              className="inline-flex items-center justify-center size-9 rounded-md hover:bg-accent-light transition-colors lg:hidden"
              aria-label="فتح القائمة"
            >
              <Menu className="w-6 h-6 text-text-dark" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
