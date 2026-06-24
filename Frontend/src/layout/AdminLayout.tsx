import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useGetProfileQuery } from "@/api/user.api";
import { EUserRole } from "@/types/entities/user.types";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminHeader } from "@/features/admin/components/AdminHeader";



export default function AdminLayout() {
  const token = localStorage.getItem("token");
  const { data: profileResponse, isLoading, isError } = useGetProfileQuery(undefined, { skip: !token });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. If there's no auth token, redirect to login page
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. While fetching the user profile, show a sleek loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-cream" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          {/* Subtle loading spinner using theme color */}
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="text-lg font-bold text-text-dark font-medium">جاري التحقق من الصلاحيات...</div>
        </div>
      </div>
    );
  }

  const user = profileResponse?.data?.user;

  // 3. If there's an error, no user, or the role is not Admin, redirect to home page
  if (isError || !user || user.role !== EUserRole.Admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-bg-cream font-sans" dir="rtl">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-64 border-l-2 border-accent-light shrink-0 sticky top-0 h-screen">
        <AdminSidebar user={user} />
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <AdminSidebar user={user} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AdminHeader user={user} onMenuClick={() => setSidebarOpen(true)} />

        {/* Dashboard Pages Workspace */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="container mx-auto">
            <Outlet context={{ setSidebarOpen }} />
          </div>
        </main>
      </div>
    </div>
  );
}
