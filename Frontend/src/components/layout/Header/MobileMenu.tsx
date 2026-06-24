import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, X, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { navItems, iconActions, userActions, navLinkVariant } from "./data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
  isStoreRoute?: boolean;
  subdomain?: string;
  subcategories?: Array<{ id: string; name: string }>;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  onLogout,
  isStoreRoute = false,
  subdomain = "",
  subcategories = [],
}: MobileMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
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
        className={`fixed left-0 top-0 z-70 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
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

          <div className="px-4 py-4 border-b border-gray-200 bg-linear-to-br from-accent-light/30 to-primary/5">
            <div className="flex flex-col items-center text-center">
              {user ? (
                <>
                  <UserAvatar
                    name={user.name}
                    avatarUrl={user.profilePhotoUrl}
                    className="w-16 h-16 mb-3 rounded-2xl shadow-md"
                  />
                  <h3 className="text-base font-bold text-gray-900 mb-0.5">
                    مرحباً، {user.name}
                  </h3>
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

          <nav className="flex-1 py-3 px-4 overflow-y-auto overflow-x-hidden">
            <ul className="space-y-1">
              {isStoreRoute ? (
                subcategories.length > 0 ? (
                  subcategories.map((subcat) => (
                    <li key={subcat.id}>
                      <Link
                        to={`/${subdomain}/products?subcat=${subcat.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-cream transition-colors text-base font-semibold text-text-dark text-right w-full"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{subcat.name}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link
                      to={`/${subdomain}/products`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-cream transition-colors text-base font-semibold text-text-dark text-right w-full"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>كل المنتجات</span>
                    </Link>
                  </li>
                )
              ) : (
                navItems.map((item) => (
                  <li key={item.href} className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="flex flex-1 items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-cream transition-colors"
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
                          icon={
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                openSections[item.label] ? "rotate-180" : ""
                              }`}
                            />
                          }
                        />
                      )}
                    </div>

                    {item.subItems && openSections[item.label] && (
                      <ul className="my-2 mr-12 flex flex-col gap-3">
                        {item.subItems.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              to={sub.href}
                              onClick={onClose}
                              className="block w-full py-1.5 text-right rounded-lg text-sm text-gray-600 hover:bg-accent-light/30 hover:text-primary transition-colors duration-150"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))
              )}

              {iconActions.map((action) => {
                const isActive = location.pathname === action.href;
                return (
                  <li key={action.href}>
                    <Link
                      to={action.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${navLinkVariant(isActive)}`}
                    >
                      {action.icon}
                      <span className="text-base font-medium">
                        {action.label}
                      </span>
                    </Link>
                  </li>
                );
              })}

              {user &&
                userActions.map((action) => {
                  const isActive = action.href === location.pathname;
                  const Icon = action.icon;
                  return (
                    <li key={action.href}>
                      <Link
                        to={action.href}
                        onClick={onClose}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${navLinkVariant(isActive)}`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-base font-medium">
                          {action.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 px-4 py-3">
            {user ? (
              <Button
                variant="hero"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="gap-3 px-4 py-3 rounded-xl transition-all duration-200  text-red-500 hover:bg-red-50 "
                icon={<LogOut className="w-5 h-5 shrink-0" />}
                iconPos="right"
              >
                <span className="text-sm font-semibold leading-none">
                  تسجيل الخروج
                </span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/auth/login");
                }}
                variant="primary"
                className="w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                icon={<LogIn className="w-5 h-5 shrink-0 text-white" />}
                iconPos="right"
              >
                <span className="text-sm leading-none">تسجيل الدخول</span>
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
