import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useGetProfileQuery } from "@/api/user.api";
import { EUserRole } from "@/types/entities/user.types";

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
      {/* Sidebar Desktop Placeholder (Will be replaced in Commit 3) */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary-dark text-white border-l-2 border-accent-light shrink-0">
        <div className="p-6 font-bold text-xl border-b border-white/10 text-center">لوحة تحكم المدير</div>
        <div className="flex-1 p-6 text-sm text-white/60 text-center flex items-center justify-center">
          [شريط التنقل - قيد الإنشاء]
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile Drawer Placeholder (Will be replaced in Commit 3) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-primary-dark text-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 font-bold text-xl border-b border-white/10 flex justify-between items-center">
          <span>لوحة تحكم المدير</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-accent transition-colors cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
        </div>
        <div className="p-6 text-sm text-white/60 text-center flex items-center justify-center h-[calc(100vh-80px)]">
          [شريط التنقل - قيد الإنشاء]
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Placeholder (Will be replaced in Commit 4) */}
        <header className="h-16 bg-white border-b-2 border-accent-light px-6 flex items-center justify-between shadow-xs">
          <button
            className="lg:hidden p-2 text-text-dark hover:text-primary hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح القائمة"
          >
            {/* Elegant hamburger menu icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div className="text-lg font-bold text-text-dark">لوحة التحكم للرئيس</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted font-medium">{user.name}</span>
          </div>
        </header>

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
