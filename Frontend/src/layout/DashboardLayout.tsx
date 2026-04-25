import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

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
        <DashboardHeader userName={userName} storeName={storeName} />

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
