import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ShoppingCart,
  Heart,
  Menu,
  Search,
  Store,
  ChevronDown,
  User,
  X,
  Package,
  LogIn,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { IUserInfo } from "@/types/entities/user.types";

// ─── Types ───────────────────────────────────────────────────────────────────
interface SubItem {
  label: string;
  href: string;
}

interface NavItemData {
  label: string;
  href: string;
  icon?: ReactNode;
  subItems?: SubItem[];
}

// ─── Nav Data ────────────────────────────────────────────────────────────────
const navItems: NavItemData[] = [
  {
    label: "المنتجات",
    href: "/products",
    icon: <Package className="w-5 h-5 text-primary" />,
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
    icon: <Store className="w-5 h-5 text-primary" />,
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
    label: "المفضلة",
  },
  {
    icon: <ShoppingCart className="w-5 h-5 text-text-dark" />,
    href: "/cart",
    ariaLabel: "سلة التسوق",
    label: "سلة التسوق",
  },
];

// ─── SubNavItem ──────────────────────────────────────────────────────────────
function SubNavItem({
  label,
  href,
  className,
  onClick,
}: SubItem & { className?: string; onClick?: () => void }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`w-full h-9 px-4! py-2! text-sm text-text-dark hover:bg-bg-cream hover:text-primary rounded-lg transition-colors ${className ?? ""}`}
    >
      {label}
    </Link>
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

function MobileMenu({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: Pick<IUserInfo, "name" | "email" | "profilePhotoUrl"> | null;
}) {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 overflow-hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        dir="rtl"
        className={`fixed left-0 top-0 z-70 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4! border-b border-accent-light">
            <h2 className="text-lg font-bold text-text-dark">
              القائمة الرئيسية
            </h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center size-8 rounded-md text-text-dark hover:bg-accent-light transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="border-b border-gray-200 bg-linear-to-br from-accent-light/30 to-primary/5">
            <div className="flex flex-col items-center text-center p-4!">
              {user ? (
                <>
                  <UserAvatar 
                    name={user.name} 
                    avatarUrl={user.profilePhotoUrl} 
                    className="w-16 h-16 mb-3 rounded-2xl shadow-md"
                  />
                  <h3 className="text-base font-bold text-gray-900 mb-0.5">مرحباً، {user.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-linear-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base text-gray-900 mb-0.5">مرحباً بك</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    قم بتسجيل الدخول للاستفادة من جميع المزايا
                  </p>
                </>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4! px-2! justify-center">
            {navItems.map((item) => (
              <div key={item.href} className="px-5! py-1! flex flex-col ">
                <div className="flex items-center justify-between">
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex flex-1 items-center gap-3 px-2 py-3 rounded-lg hover:bg-bg-cream transition-colors"
                  >
                    {item.icon}
                    <span className="text-base font-semibold text-text-dark">
                      {item.label}
                    </span>
                  </Link>

                  {item.subItems && (
                    <Button
                      onClick={() => toggleSection(item.label)}                      
                      variant="tertiary"

                      className="inline-flex size-9! text-primary transition-colors"
                      aria-label={`فتح ${item.label}`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openSections[item.label] ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  )}
                </div>

                {item.subItems && openSections[item.label] && (
                  <ul className="mt-2! mr-8! space-y-1 flex flex-col gap-3">
                    {item.subItems.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          to={sub.href}
                          onClick={onClose}
                          className="block w-full text-right rounded-lg text-sm text-gray-600 hover:bg-accent-light/30 hover:text-primary transition-colors duration-150"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="mt-2 py-4! px-5! space-y-1 flex flex-col gap-3">
              {iconActions.map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg hover:bg-bg-cream transition-colors"
                >
                  {action.icon}
                  <span className="text-base font-medium text-text-dark">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200 flex justify-center">
            {user ? (
              <Button
                type="button"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  localStorage.removeItem("user");
                  onClose();
                  window.location.href = "/auth/login";
                }}
                className="h-12! w-full justify-start! m-2! gap-3 p-3! rounded-xl! transition-all duration-200 bg-red-700 text-white hover:bg-red-600 hover:text-white"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold leading-none">تسجيل الخروج</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/auth/login");
                }}
                variant="primary"
                className="h-12! w-full justify-start! m-2! gap-3 p-3! rounded-xl! transition-all duration-200"
              >
                <LogIn className="w-5 h-5 shrink-0 text-white" />
                <span className="text-sm leading-none">تسجيل الدخول</span>
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const isAuthenticated = !!token && !!user?.role;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto ps-8! pe-4 md:ps-12! md:pe-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-primary">دكان</span>
            </Link>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} />
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

            {/* Desktop icon actions + mobile menu toggle */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden lg:flex items-center gap-4">
                {iconActions.map((action) => (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="inline-flex items-center justify-center size-9 rounded-md hover:bg-accent-light transition-colors"
                    aria-label={action.ariaLabel}
                  >
                    {action.icon}
                  </Link>
                ))}

                {/* User Profile */}
                {isAuthenticated && user ? (
                  <div className="relative group/user">
                    <button className="inline-flex items-center justify-center size-9 rounded-md hover:bg-accent-light transition-colors">
                      <UserAvatar name={user.name} avatarUrl={user.profilePhotoUrl} className="w-7 h-7" />
                    </button>
                    {/* User Dropdown */}
                    <div className="absolute top-10 left-0 pt-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 z-50">
                      <div className="w-64 bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">
                        <div className="p-4 flex items-center gap-3 bg-gray-50/50 border-b border-gray-100">
                          <UserAvatar name={user.name} avatarUrl={user.profilePhotoUrl} className="w-10 h-10 shrink-0 shadow-sm" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-900 truncate">{user.name}</span>
                            <span className="text-xs text-gray-500 truncate">{user.email}</span>
                          </div>
                        </div>
                        <div className="p-2 space-y-0.5">
                          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-xl transition-colors">
                            <User className="w-4 h-4 text-gray-500" />
                            الملف الشخصي
                          </Link>
                          <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-xl transition-colors">
                            <Package className="w-4 h-4 text-gray-500" />
                            طلباتي
                          </Link>
                          {user.role === 'StoreOwner' && (
                            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-xl transition-colors">
                              <Store className="w-4 h-4 text-gray-500" />
                              لوحة تحكم البائع
                            </Link>
                          )}
                        </div>
                        <div className="p-2 border-t border-gray-100">
                          <button
                            onClick={() => {
                              localStorage.removeItem("token");
                              localStorage.removeItem("role");
                              localStorage.removeItem("user");
                              window.location.href = "/auth/login";
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-start"
                          >
                            <LogOut className="w-4 h-4" />
                            تسجيل الخروج
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center justify-center size-9 rounded-md hover:bg-accent-light transition-colors"
                    aria-label="حسابي"
                  >
                    <User className="w-5 h-5 text-text-dark" />
                  </Link>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center justify-center size-9 rounded-md hover:bg-accent-light transition-colors lg:hidden"
                aria-label="فتح القائمة"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-6 h-6 text-text-dark" />
              </button>
            </div>
          </div>
        </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
      />      
    </header>

  );
}
