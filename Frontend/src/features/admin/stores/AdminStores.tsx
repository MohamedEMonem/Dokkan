import { useState, useEffect } from "react";
import {
  useAdminListStoresQuery,
  useAdminSuspendStoreMutation,
  useAdminRestoreStoreMutation,
  useAdminUpdateStoreStatusMutation,
} from "@/api/store.api";
import { EStoreStatus } from "@/types/entities/store.types";
import { StoresFilter, StoresFilterState } from "./components/StoresFilter";
import { StoresTable } from "./components/StoresTable";
import { Pagination } from "@/components/ui/Pagination";
import { showNotification } from "@/utils/showNotification";
import { Store, CheckCircle, Clock, Ban } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

export function AdminStores() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState<StoresFilterState>({
    search: "",
    status: "",
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

  const handleFilterChange = (updated: Partial<StoresFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setPage(1);
  };

  // ── Fetch paginated list ──────────────────────────────────────────────── //
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useAdminListStoresQuery({
    page,
    limit,
    status: (filters.status as EStoreStatus) || undefined,
    search: debouncedSearch || undefined,
    sortBy: filters.sortBy as any,
    sortDir: filters.sortDir,
  });

  // ── Fetch global counts for stat cards ───────────────────────────────── //
  const { data: allStoresRes } = useAdminListStoresQuery({ limit: 1 });
  const { data: activeStoresRes } = useAdminListStoresQuery({ limit: 1, status: EStoreStatus.Active });
  const { data: pendingStoresRes } = useAdminListStoresQuery({ limit: 1, status: EStoreStatus.Pending });
  const { data: suspendedStoresRes } = useAdminListStoresQuery({ limit: 1, status: EStoreStatus.Suspended });

  const stores = response?.data?.stores || [];
  const meta = response?.data?.meta;
  const totalPages = meta?.totalPages || 0;

  const globalTotal = allStoresRes?.data?.meta?.total ?? "...";
  const globalActive = activeStoresRes?.data?.meta?.total ?? "...";
  const globalPending = pendingStoresRes?.data?.meta?.total ?? "...";
  const globalSuspended = suspendedStoresRes?.data?.meta?.total ?? "...";

  // ── Mutations ──────────────────────────────────────────────────────────── //
  const [adminSuspendStore] = useAdminSuspendStoreMutation();
  const [adminRestoreStore] = useAdminRestoreStoreMutation();
  const [adminUpdateStoreStatus] = useAdminUpdateStoreStatusMutation();

  const handleUpdateStatus = async (
    storeId: string,
    currentStatus: EStoreStatus,
    newStatus: EStoreStatus
  ) => {
    try {
      if (newStatus === EStoreStatus.Suspended) {
        await adminSuspendStore({ storeId }).unwrap();
        showNotification({
          message: "تم حظر المتجر بنجاح",
          variant: "success",
        });
      } else if (newStatus === EStoreStatus.Active) {
        // Use restore endpoint for suspended stores (which are deleted)
        if (currentStatus === EStoreStatus.Suspended) {
          await adminRestoreStore({ storeId }).unwrap();
          showNotification({
            message: "تم استعادة وتفعيل المتجر بنجاح",
            variant: "success",
          });
        } else if (currentStatus === EStoreStatus.Pending) {
          // Use status update endpoint for pending stores
          await adminUpdateStoreStatus({ storeId, status: EStoreStatus.Active }).unwrap();
          showNotification({
            message: "تم الموافقة على المتجر وتفعيله بنجاح",
            variant: "success",
          });
        }
      }
    } catch (err: any) {
      showNotification({
        message: err?.data?.message || "حدث خطأ أثناء محاولة تحديث حالة المتجر",
        variant: "error",
      });
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    try {
      await adminSuspendStore({ storeId }).unwrap();
      showNotification({
        message: "تم حذف المتجر بنجاح من المنصة",
        variant: "success",
      });
    } catch (err: any) {
      showNotification({
        message: err?.data?.message || "حدث خطأ أثناء محاولة حذف المتجر",
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
            إدارة المتاجر
          </h2>
          <p className="text-text-muted text-sm mt-1">
            مراقبة جميع المتاجر المسجلة على المنصة والموافقة على الطلبات المعلقة.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المتاجر المسجلة"
          value={isLoading ? "..." : globalTotal}
          icon={<Store className="w-5 h-5 text-primary" />}
          variant="default"
        />
        <StatCard
          title="المتاجر النشطة"
          value={isLoading ? "..." : globalActive}
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          variant="default"
        />
        <StatCard
          title="قيد المراجعة"
          value={isLoading ? "..." : globalPending}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          variant="default"
        />
        <StatCard
          title="المتاجر المحظورة"
          value={isLoading ? "..." : globalSuspended}
          icon={<Ban className="w-5 h-5 text-red-500" />}
          variant="default"
        />
      </div>

      {/* Search & Filter */}
      <StoresFilter filters={filters} onChange={handleFilterChange} />

      {/* Stores Table */}
      {isError ? (
        <div className="w-full bg-white rounded-xl border-2 border-accent-light p-8 text-center text-red-500 font-medium">
          حدث خطأ أثناء تحميل البيانات من الخادم. يرجى المحاولة مرة أخرى لاحقاً.
        </div>
      ) : (
        <StoresTable
          stores={stores}
          isLoading={isLoading || isFetching}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteStore}
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

export default AdminStores;
