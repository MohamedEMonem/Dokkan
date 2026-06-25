import { useState, useEffect } from "react";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "@/api/order.api";
import { EOrderStatus, IOrder } from "@/types/entities/order.types";
import { AdminOrdersFilters, AdminOrdersFilterState } from "./components/AdminOrdersFilters";
import { AdminOrdersTable } from "./components/AdminOrdersTable";
import { Pagination } from "@/components/ui/Pagination";
import { showNotification } from "@/utils/showNotification";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { generateInvoicePdf } from "@/features/invoices/utils/generateInvoicePdf";
import OrderDetailsModal from "@/features/dashboard/components/OrderDetailsModal";

export function AdminOrders() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filter States
  const [filters, setFilters] = useState<AdminOrdersFilterState>({
    search: "",
    status: "",
    paymentStatus: "",
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // Debounced search state to prevent server hammering on keystrokes
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1); // Reset to first page on search change
    }, 400);

    return () => clearTimeout(handler);
  }, [filters.search]);

  // Handle filter changes
  const handleFilterChange = (updatedFilters: Partial<AdminOrdersFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
    setPage(1); // Reset page on filter change
  };

  // Fetch live orders from API
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetOrdersQuery({
    page,
    limit,
    status: filters.status ? (filters.status as EOrderStatus) : undefined,
    sortBy: filters.sortBy as any,
    sortDir: filters.sortDir,
  });

  // Fetch counts for stat cards
  const { data: totalOrdersRes } = useGetOrdersQuery({ limit: 1 });
  const { data: pendingOrdersRes } = useGetOrdersQuery({ limit: 1, status: EOrderStatus.Pending });
  const { data: deliveredOrdersRes } = useGetOrdersQuery({ limit: 1, status: EOrderStatus.Delivered });
  const { data: cancelledOrdersRes } = useGetOrdersQuery({ limit: 1, status: EOrderStatus.Cancelled });

  const apiOrders = response?.data?.orders || [];
  
  // Client-side search and payment status filter
  const filteredOrders = apiOrders.filter((order) => {
    // 1. Search Query Match
    const matchesSearch = !debouncedSearch || (
      order.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      (order.shippingAddress?.username && order.shippingAddress.username.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      (order.store?.name && order.store.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    );

    // 2. Payment Status Match
    const matchesPayment = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;

    return matchesSearch && matchesPayment;
  });

  const meta = response?.data?.meta;
  const totalPages = meta?.totalPages || 1;

  // Resolve global platform counts
  const globalTotalOrders = totalOrdersRes?.data?.meta?.total ?? "...";
  const globalPendingOrders = pendingOrdersRes?.data?.meta?.total ?? "...";
  const globalDeliveredOrders = deliveredOrdersRes?.data?.meta?.total ?? "...";
  const globalCancelledOrders = cancelledOrdersRes?.data?.meta?.total ?? "...";

  // Update order status mutation
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleOrderStatusChange = async (orderId: string, nextStatus: EOrderStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: nextStatus }).unwrap();
      showNotification({
        message: `تم تغيير حالة الطلب بنجاح إلى "${
          nextStatus === EOrderStatus.Shipped
            ? "تم الشحن"
            : nextStatus === EOrderStatus.Delivered
            ? "تم التوصيل"
            : nextStatus === EOrderStatus.Cancelled
            ? "ملغي"
            : "قيد الانتظار"
        }"`,
        variant: "success",
      });
    } catch (err: any) {
      showNotification({
        message: err?.data?.message || "حدث خطأ أثناء محاولة تعديل حالة الطلب",
        variant: "error",
      });
    }
  };

  // Print invoice helper
  const handlePrintInvoice = async (order: IOrder) => {
    try {
      await generateInvoicePdf(order, {
        filename: `invoice-${order.id}.pdf`,
      });
      showNotification({
        message: `تم تجهيز فاتورة الطلب ${order.id} للطباعة.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to print invoice", error);
      showNotification({
        message: `تعذر طباعة فاتورة الطلب ${order.id}.`,
        variant: "error",
      });
    }
  };

  // Selected order state for the details modal
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  // Set document title for SEO
  useEffect(() => {
    document.title = "دكان - لوحة المدير - إدارة الطلبات العامة";
  }, []);

  return (
    <div className="space-y-6 w-full font-sans select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-dark font-sans text-right">إدارة الطلبات العامة</h1>
        <p className="text-text-muted text-sm mt-1 text-right">مراقبة جميع الطلبات الجارية والمكتملة والملغاة عبر المنصة.</p>
      </div>

      {/* Sub-header mini stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الطلبات بالمنصة"
          value={isLoading ? "..." : globalTotalOrders}
          icon={<ShoppingBag className="w-5 h-5 text-primary" />}
          variant="default"
        />
        <StatCard
          title="طلبات قيد الانتظار"
          value={isLoading ? "..." : globalPendingOrders}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          variant="default"
        />
        <StatCard
          title="طلبات تم توصيلها"
          value={isLoading ? "..." : globalDeliveredOrders}
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          variant="default"
        />
        <StatCard
          title="طلبات ملغاة"
          value={isLoading ? "..." : globalCancelledOrders}
          icon={<XCircle className="w-5 h-5 text-red-500" />}
          variant="default"
        />
      </div>

      {/* Search & Filter section */}
      <AdminOrdersFilters filters={filters} onChange={handleFilterChange} />

      {/* Orders Table list */}
      {isError ? (
        <div className="w-full bg-white rounded-xl border-2 border-accent-light p-8 text-center text-red-500 font-medium">
          حدث خطأ أثناء تحميل البيانات من الخادم. يرجى المحاولة مرة أخرى لاحقاً.
        </div>
      ) : (
        <AdminOrdersTable
          orders={filteredOrders}
          isLoading={isLoading || isFetching}
          onView={setSelectedOrder}
          onPrint={handlePrintInvoice}
          onChangeStatus={handleOrderStatusChange}
        />
      )}

      {/* Pagination Footer */}
      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-6"
        />
      )}

      {/* Order Details modal */}
      {selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder.id}
          onClose={() => setSelectedOrder(null)}
          onPrint={handlePrintInvoice}
        />
      )}
    </div>
  );
}

export default AdminOrders;
