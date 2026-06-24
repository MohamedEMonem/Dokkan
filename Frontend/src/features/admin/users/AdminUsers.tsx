import { useState, useEffect } from "react";
import { useAdminListUsersQuery, useAdminDeleteUserMutation } from "@/api/user.api";
import { UsersFilter, UsersFilterState } from "./components/UsersFilter";
import { UsersTable } from "./components/UsersTable";
import { Pagination } from "@/components/ui/Pagination";
import { showNotification } from "@/utils/showNotification";
import { Users, UserCheck, Store } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

export function AdminUsers() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState<UsersFilterState>({
    search: "",
    role: "",
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // Debounced search to avoid hammering the server on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const handleFilterChange = (updated: Partial<UsersFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setPage(1);
  };

  // ── Fetch paginated list ──────────────────────────────────────────────── //
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useAdminListUsersQuery({
    page,
    limit,
    role: (filters.role as any) || undefined,
    search: debouncedSearch || undefined,
    sortBy: filters.sortBy as any,
    sortDir: filters.sortDir,
  });

  // ── Fetch global counts for stat cards ───────────────────────────────── //
  const { data: allUsersRes } = useAdminListUsersQuery({ limit: 1 });
  const { data: customersRes } = useAdminListUsersQuery({ limit: 1, role: "Customer" });
  const { data: storeOwnersRes } = useAdminListUsersQuery({ limit: 1, role: "StoreOwner" });

  const users = response?.data?.users || [];
  const meta = response?.data?.meta;
  const totalPages = meta?.totalPages || 0;

  const globalTotal = allUsersRes?.data?.meta?.total ?? "...";
  const globalCustomers = customersRes?.data?.meta?.total ?? "...";
  const globalStoreOwners = storeOwnersRes?.data?.meta?.total ?? "...";

  // ── Delete mutation ───────────────────────────────────────────────────── //
  const [adminDeleteUser] = useAdminDeleteUserMutation();

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminDeleteUser({ userId }).unwrap();
      showNotification({
        message: "تم حذف حساب المستخدم بنجاح من المنصة",
        variant: "success",
      });
    } catch (err: any) {
      showNotification({
        message: err?.data?.message || "حدث خطأ أثناء محاولة حذف الحساب",
        variant: "error",
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────── //
  return (
    <div className="space-y-6 w-full font-sans select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-dark">
            إدارة حسابات المستخدمين
          </h2>
          <p className="text-text-muted text-sm mt-1">
            مراقبة جميع المستخدمين المسجلين على المنصة وإدارة حساباتهم.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="إجمالي المستخدمين المسجلين"
          value={isLoading ? "..." : globalTotal}
          icon={<Users className="w-5 h-5 text-primary" />}
          variant="default"
        />
        <StatCard
          title="العملاء النشطون"
          value={isLoading ? "..." : globalCustomers}
          icon={<UserCheck className="w-5 h-5 text-emerald-500" />}
          variant="default"
        />
        <StatCard
          title="أصحاب المتاجر"
          value={isLoading ? "..." : globalStoreOwners}
          icon={<Store className="w-5 h-5 text-blue-500" />}
          variant="default"
        />
      </div>

      {/* Search & Filter */}
      <UsersFilter filters={filters} onChange={handleFilterChange} />

      {/* Users Table */}
      {isError ? (
        <div className="w-full bg-white rounded-xl border-2 border-accent-light p-8 text-center text-red-500 font-medium">
          حدث خطأ أثناء تحميل البيانات من الخادم. يرجى المحاولة مرة أخرى لاحقاً.
        </div>
      ) : (
        <UsersTable
          users={users}
          isLoading={isLoading || isFetching}
          onDelete={handleDeleteUser}
        />
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-6"
        />
      )}
    </div>
  );
}

export default AdminUsers;
