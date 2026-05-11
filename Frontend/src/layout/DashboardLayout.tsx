import { Outlet } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useGetStoreQuery } from "@/api/store.api";

export default function DashboardLayout() {
  const { data, isLoading, isError } = useGetStoreQuery();
  const storeName = data?.data?.store?.name || "متجري";

  // Only block on first load — never block if there's an error (e.g. 401, 404)
  if (isLoading && !isError) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-linear-to-br from-bg-cream via-bg-cream to-accent-light"
      dir="rtl"
    >
      <DashboardHeader storeName={storeName} />

      {/* Dashboard Content */}
      <main className="flex-1 w-full container mx-auto px-4 md:px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
