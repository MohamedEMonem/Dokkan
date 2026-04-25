import { Outlet, NavLink } from "react-router-dom";
import {
  Store,
  Bell,
  Sparkles,
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const userName = user.name;
  const storeName = "storey"; // To be changed

  const navLinks = [
    { name: "نظرة عامة", path: "/dashboard", icon: LayoutDashboard },
    { name: "المنتجات", path: "/dashboard/products", icon: Package },
    { name: "الطلبات", path: "/dashboard/orders", icon: ShoppingBag },
    { name: "التحليلات", path: "/dashboard/analytics", icon: BarChart3 },
    { name: "إعدادات المتجر", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-bg-cream via-bg-cream to-accent-light" dir="rtl">
        {/* Top Header Banner */}
        <header className="bg-linear-to-l from-primary to-primary-light text-white py-8 px-4 shadow-lg">
          <div className="container mx-auto">
            {/* Top Row: User Info + Actions */}
            <div className="flex items-center justify-between mb-6">
              {/* Right Section: User & Store Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg">
                  <Store className="w-9 h-9" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">مرحباً، {userName}</h1>
                  <p className="text-white/90 text-lg">
                    لوحة تحكم البائع - {storeName}
                  </p>
                </div>
              </div>

              {/* Left Section: Actions */}
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative">
                  <Button
                    variant="tertiary"
                    icon={<Bell className="w-6 h-6" />}
                    className="relative p-3 rounded-xl text-white hover:bg-white/10"
                  >
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </div>

                {/* Create Store CTA */}
                <Button
                  variant="accent"
                  icon={<Sparkles className="w-5 h-5" />}
                  iconPos="right"
                  className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
                >
                  إنشاء متجري
                </Button>
              </div>
            </div>

            {/* Stats Cards Area — reserved for dashboard stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Stat cards will be rendered here via the Outlet / page */}
            </div>
          </div>
        </header>

        {/* Navigation Bar */}
        <div className="container mx-auto px-8 mt-6">
          <nav className="bg-white border border-gray-200 rounded-full p-1 flex items-center justify-start gap-1 w-fit shadow-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-sm font-medium ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-text-dark hover:bg-gray-50"
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        <main className="flex-1 container mx-auto px-8 py-8">
          <Outlet />
        </main>
      </div>
  );
}
