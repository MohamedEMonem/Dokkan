import { useState, useEffect } from "react";
import { useAdminListUsersQuery, useAdminDeleteUserMutation } from "@/api/user.api";
import { IUser } from "@/types/entities/user.types";
import { UsersFilter, UsersFilterState } from "./components/UsersFilter";
import { UsersTable } from "./components/UsersTable";
import { Pagination } from "@/components/ui/Pagination";
import { showNotification } from "@/utils/showNotification";
import { Users, UserCheck, Store, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

// ── Fallback dummy data (shown when backend returns nothing) ──────────────── //

const dummyUsers: IUser[] = [
  {
    id: "u1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "Customer" as any,
    isVerified: true,
    contactNumber: "+201012345678",
    profilePhotoUrl: null,
    googleOauthId: null,
    password: "",
    createdAt: new Date("2025-01-15"),
  } as IUser,
  {
    id: "u2",
    name: "سارة علي",
    email: "sara@example.com",
    role: "StoreOwner" as any,
    isVerified: true,
    contactNumber: "+201098765432",
    profilePhotoUrl: null,
    googleOauthId: null,
    password: "",
    createdAt: new Date("2025-02-20"),
  } as IUser,
  {
    id: "u3",
    name: "محمد عبدالله",
    email: "mabdullah@example.com",
    role: "Customer" as any,
    isVerified: false,
    contactNumber: null,
    profilePhotoUrl: null,
    googleOauthId: null,
    password: "",
    createdAt: new Date("2025-03-10"),
  } as IUser,
  {
    id: "u4",
    name: "ليلى حسن",
    email: "laila@example.com",
    role: "StoreOwner" as any,
    isVerified: true,
    contactNumber: "+966501234567",
    profilePhotoUrl: null,
    googleOauthId: null,
    password: "",
    createdAt: new Date("2025-04-05"),
  } as IUser,
  {
    id: "u5",
    name: "Admin System",
    email: "admin@dokkan.com",
    role: "Admin" as any,
    isVerified: true,
    contactNumber: null,
    profilePhotoUrl: null,
    googleOauthId: null,
    password: "",
    createdAt: new Date("2025-01-01"),
  } as IUser,
];

// ── Main Component ────────────────────────────────────────────────────────── //

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

  // ── Fetch main paginated list ─────────────────────────────────────────── //
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
  const { data: customersRes } = useAdminListUsersQuery({
    limit: 1,
    role: "Customer",
  });
  const { data: storeOwnersRes } = useAdminListUsersQuery({
    limit: 1,
    role: "StoreOwner",
  });

  // ── Derive display data ───────────────────────────────────────────────── //
  const apiUsers = response?.data?.users || [];
  const rawUsers = apiUsers.length > 0 ? apiUsers : dummyUsers;
  // Client-side search fallback (when server doesn't support search natively)
  const users = rawUsers; // server handles search; no client filter needed

  const meta = response?.data?.meta;
  const totalPages = apiUsers.length > 0 ? (meta?.totalPages || 0) : 1;

  const globalTotal =
    allUsersRes?.data?.meta?.total ?? dummyUsers.length;
  const globalCustomers =
    customersRes?.data?.meta?.total ??
    dummyUsers.filter((u) => u.role === "Customer").length;
  const globalStoreOwners =
    storeOwnersRes?.data?.meta?.total ??
    dummyUsers.filter((u) => u.role === "StoreOwner").length;

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
