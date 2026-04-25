import { Outlet, NavLink } from "react-router-dom";
import {
  Store,
  Bell,
  Eye,
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
    <main className="flex-1" dir="rtl">
      <div className="min-h-screen bg-linear-to-br from-bg-cream via-bg-cream to-accent-light">
        {/* Top Header Banner */}
        <header className="bg-primary text-white py-6 px-8 flex justify-between items-center shadow-md">
          {/* Right Section: User & Store Info */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">مرحباً، {userName}</h1>
              <p className="text-sm opacity-90">
                لوحة تحكم البائع - {storeName}
              </p>
            </div>
          </div>

          {/* Left Section: Actions */}
          <div className="flex items-center gap-6">
            <Button
              variant="primary"
              icon={<Bell className="w-6 h-6" />}
              className="relative p-2.5"
            >
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Button
              variant="accent"
              icon={<Eye className="w-5 h-5" />}
              iconPos="left"
              className="px-6 py-2.5 rounded-xl "
            >
              عرض متجري
            </Button>
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
                <link.icon className="w-[18px] h-[18px]" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="container mx-auto px-8 py-8">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
