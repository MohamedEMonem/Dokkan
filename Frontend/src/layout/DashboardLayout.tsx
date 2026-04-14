import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const userName = "Store Owner"; // To be changed
  return (
    <div className="min-h-screen bg-bg-cream" dir="rtl">
      {/* Top banner */}
      <div className="bg-primary text-white py-4 px-8">
        <p className="text-sm">لوحة تحكم صاحب المتجر</p>
      </div>

      {/* Dashboard content */}
      <div className="container mx-auto px-8 py-12">
        <div className="text-2xl font-semibold text-text-dark">
          مرحباً، {userName} 👋
        </div>
      </div>

      <Outlet />
    </div>

  );
}
