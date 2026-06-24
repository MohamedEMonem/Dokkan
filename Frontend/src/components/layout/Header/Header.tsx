import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Store, Search, User, Menu, LogOut } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useGetProfileQuery } from "@/api/user.api";
import { useListStoresQuery } from "@/api/store.api";
import { useGetProductsByStoreIdQuery } from "@/api/product.api";

import { navItems, iconActions, userActions, navLinkVariant } from "./data";
import NavItem from "./NavItem";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const location = useLocation();
  const { subdomain } = useParams<{ subdomain: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const { data: profileResponse } = useGetProfileQuery(undefined, { skip: !token });
  const user = profileResponse?.data?.user;
  const isAuthenticated = !!token && !!user;

  const isStoreRoute = !!subdomain && subdomain.startsWith("@");
  const cleanSubdomain = isStoreRoute ? subdomain.slice(1) : "";

  // 1. Fetch store info
  const { data: storeResponse, isLoading: isStoreLoading } = useListStoresQuery(
    { subdomain: cleanSubdomain },
    { skip: !isStoreRoute }
  );
  const store = storeResponse?.data?.stores?.[0];

  // 2. Fetch products for this store to get its subcategories
  const { data: productsResponse } = useGetProductsByStoreIdQuery(
    store?.id || "",
    { skip: !store?.id }
  );
  const productsList = productsResponse?.data?.products || [];

  // 3. Extract subcategories from live products list
  const subcategories = useMemo(() => {
    const map = new Map<string, string>();
    productsList.forEach((p) => {
      const subCat = (p as any).subCategory;
      if (subCat) {
        map.set(subCat.id, subCat.name);
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, ["ar", "en"]));
  }, [productsList]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to={isStoreRoute ? `/${subdomain}` : "/"} className="flex items-center gap-2">
            {isStoreRoute ? (
              isStoreLoading ? (
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse shrink-0" />
              ) : store?.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-white" />
                </div>
              )
            ) : (
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shrink-0">
                <Store className="w-6 h-6 text-white" />
              </div>
            )}
            <span className="text-xl text-primary font-bold">
              {isStoreRoute ? (
                isStoreLoading ? (
                  <div className="w-20 h-5 bg-gray-200 rounded-md animate-pulse" />
                ) : (
                  store?.name || "المتجر"
                )
              ) : (
                "دكان"
              )}
            </span>
          </Link>

          {/* Nav links (Only for global view) */}
          {!isStoreRoute && (
            <nav className="hidden lg:flex items-center gap-4">
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          )}

          {/* Search bar */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-2xl mx-auto">
            <div className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  className="h-10!"
                  placeholder="ابحث عن منتج أو متجر..."
                  icon={<Search className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>
          </div>

          {/* Icon actions + mobile menu toggle */}
          <div className="flex items-center gap-4">
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

            <div className="hidden lg:flex items-center gap-4">
              {/* User Profile */}
              {isAuthenticated && user ? (
                <div className="relative group/user">
                  <Button
                    className="inline-flex items-center justify-center size-9!"
                    aria-haspopup="true"
                    aria-expanded="false"
                    variant="hero"
                  >
                    <UserAvatar
                      name={user.name}
                      avatarUrl={user.profilePhotoUrl}
                      className="w-7 h-7"
                    />
                  </Button>
                  {/* User Dropdown */}
                  <div className="absolute top-10 left-0 pt-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible group-focus-within/user:opacity-100 group-focus-within/user:visible transition-all duration-200 z-50">
                    <div className="w-64 bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">
                      <div className="p-2 flex flex-col items-center text-center bg-gray-50/50 border-b border-gray-100">
                        <UserAvatar
                          name={user.name}
                          avatarUrl={user.profilePhotoUrl}
                          className="w-10 h-10 shrink-0 shadow-sm"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-base font-semibold text-text-dark">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500 ">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        {userActions.map((action) => {
                          const isActive = location.pathname === action.href;
                          const Icon = action.icon;
                          return (
                            <Link
                              key={action.href}
                              to={action.href}
                              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${navLinkVariant(isActive)}`}
                            >
                              <Icon className="w-4 h-4 transition-colors" />
                              {action.label}
                            </Link>
                          );
                        })}
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-start cursor-pointer"
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

      {/* Dynamic Subcategories Row (Only for store routes, horizontally scrollable) */}
      {isStoreRoute && (
        <div className="border-t border-gray-100 bg-gray-50/50 py-2.5">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-6 overflow-x-auto scrollbar-none whitespace-nowrap" dir="rtl">
              {isStoreLoading ? (
                <div className="flex gap-4">
                  <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse" />
                </div>
              ) : subcategories.length > 0 ? (
                subcategories.map((subcat) => (
                  <Link
                    key={subcat.id}
                    to={`/${subdomain}/products?subcat=${subcat.id}`}
                    className="text-base font-semibold text-text-dark hover:text-primary transition-colors duration-200 shrink-0"
                  >
                    {subcat.name}
                  </Link>
                ))
              ) : (
                <Link
                  to={`/${subdomain}/products`}
                  className="text-base font-semibold text-text-dark hover:text-primary transition-colors duration-200 shrink-0"
                >
                  كل المنتجات
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        isStoreRoute={isStoreRoute}
        subdomain={subdomain}
        subcategories={subcategories}
      />
    </header>
  );
}
