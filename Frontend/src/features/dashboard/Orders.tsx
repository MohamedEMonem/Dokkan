import { useMemo, useState } from "react";
import clsx from "clsx";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { showNotification } from "@/utils/showNotification";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Pagination } from "@/components/ui/Pagination";
import { generateInvoicePdf } from "@/features/invoices/utils/generateInvoicePdf";
import {
  useGetOrdersByStoreIdQuery,
  useUpdateOrderStatusMutation,
} from "@/api/order.api";
import type { IOrder } from "@/types/entities/order.types";
import { EOrderStatus, EPaymentStatus } from "@/types/entities/order.types";
import { formatCurrency } from "@/utils/formatCurrency";

import OrderDetailsModal from "./components/OrderDetailsModal";
import OrdersTable from "./components/OrdersTable";
import OrdersFilters from "./components/OrdersFilters";
import OrdersMobileList from "./components/OrdersMobileList";
import { useGetUserStoreQuery } from "@/api/store.api";

export type DashboardOrder = {
  id: string;
  customer: string;
  date: string;
  total: string;
  paymentStatus: "مدفوع" | "غير مدفوع";
  paymentMethod: string;
  orderStatus:
    | "قيد الانتظار"
    | "تم الشحن"
    | "جاهز للشحن"
    | "ملغي"
    | "جاري التجهيز"
    | "تم التوصيل"
    | "مكتمل";
};
export type Order = DashboardOrder;
export type PaymentStatus = DashboardOrder["paymentStatus"];
export type OrderStatus = DashboardOrder["orderStatus"];
export type PaymentFilter = "الكل" | PaymentStatus;
export type FilterStatus = "الكل" | OrderStatus;

export type StatusCounts = {
  all: number;
  pending: number;
  shipped: number;
  canceled: number;
  delivered: number;
};

const statusFilters: Array<{
  key: FilterStatus;
  label: string;
  countKey: keyof StatusCounts;
}> = [
  { key: "الكل", label: "الكل", countKey: "all" },
  { key: "قيد الانتظار", label: "قيد الانتظار", countKey: "pending" },
  { key: "تم الشحن", label: "تم الشحن", countKey: "shipped" },
  { key: "ملغي", label: "ملغي", countKey: "canceled" },
  { key: "تم التوصيل", label: "تم التوصيل", countKey: "delivered" },
];

const dashboardStatusToApiStatus = {
  "قيد الانتظار": EOrderStatus.Pending,
  "تم الشحن": EOrderStatus.Shipped,
  "تم التوصيل": EOrderStatus.Delivered,
  ملغي: EOrderStatus.Cancelled,
  "جاري التجهيز": EOrderStatus.Pending,
  "جاهز للشحن": EOrderStatus.Pending,
  مكتمل: EOrderStatus.Delivered,
} as const;

// (status maps removed; mapping is handled in `apiOrderToDashboardOrder`)

const apiOrderToDashboardOrder = (order: IOrder): DashboardOrder => {
  const total = order.totalAmount ?? 0;

  return {
    id: order.id,
    customer: order.customer?.name?.trim() ?? "غير متوفر",
    date: order.createdAt
      ? order.createdAt.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    total: formatCurrency(total),
    paymentStatus: (order.paymentStatus === "Success"
      ? "مدفوع"
      : "غير مدفوع") as DashboardOrder["paymentStatus"],
    paymentMethod: "غير متوفر",
    orderStatus: (order.status === EOrderStatus.Shipped
      ? "تم الشحن"
      : order.status === EOrderStatus.Delivered
        ? "تم التوصيل"
        : order.status === EOrderStatus.Cancelled
          ? "ملغي"
          : "قيد الانتظار") as DashboardOrder["orderStatus"],
  };
};

// const buildStatusCounts = (orders: DashboardOrder[]) => ({
//   all: orders.length,
//   pending: orders.filter((order) => order.orderStatus === "قيد الانتظار")
//     .length,
//   shipped: orders.filter((order) => order.orderStatus === "تم الشحن").length,
//   completed: orders.filter((order) => order.orderStatus === "مكتمل").length,
//   canceled: orders.filter((order) => order.orderStatus === "ملغي").length,
//   delivered: orders.filter((order) => order.orderStatus === "تم التوصيل")
//     .length,
// });

/* Desktop table extracted to ./components/OrdersTable.tsx */

const Orders = () => {
  const [activeStatus, setActiveStatus] = useState<FilterStatus>("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("الكل");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orderOverrides, setOrderOverrides] = useState<Record<string, Order>>(
    {},
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const selectedApiStatus =
    activeStatus === "الكل"
      ? undefined
      : (dashboardStatusToApiStatus[
          activeStatus
        ] as unknown as typeof EOrderStatus);

  const { data: userStoreData } = useGetUserStoreQuery();
  const storeId = userStoreData?.data.store?.id;
  const { data, isLoading, isError } = useGetOrdersByStoreIdQuery(
    {
      storeId: storeId ?? "",
      page,
      limit: pageSize,
      status: selectedApiStatus,
    },
    { skip: !storeId },
  );

  const pendingQuery = useGetOrdersByStoreIdQuery({
    storeId: storeId ?? "",
    page: 1,
    limit: 1,
    status: EOrderStatus.Pending as unknown as typeof EOrderStatus,
  });
  const shippedQuery = useGetOrdersByStoreIdQuery({
    storeId: storeId ?? "",
    page: 1,
    limit: 1,
    status: EOrderStatus.Shipped as unknown as typeof EOrderStatus,
  });
  const deliveredQuery = useGetOrdersByStoreIdQuery({
    storeId: storeId ?? "",
    page: 1,
    limit: 1,
    status: EOrderStatus.Delivered as unknown as typeof EOrderStatus,
  });
  const cancelledQuery = useGetOrdersByStoreIdQuery({
    storeId: storeId ?? "",
    page: 1,
    limit: 1,
    status: EOrderStatus.Cancelled as unknown as typeof EOrderStatus,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const apiOrders = useMemo(
    () => data?.data.orders?.map(apiOrderToDashboardOrder) ?? [],
    [data],
  );

  const orders = useMemo(
    () => apiOrders.map((order) => orderOverrides[order.id] ?? order),
    [apiOrders, orderOverrides],
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      const matchesStatus =
        activeStatus === "الكل" || order.orderStatus === activeStatus;
      const matchesPayment =
        paymentFilter === "الكل" || order.paymentStatus === paymentFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        [
          order.id,
          order.customer,
          order.total,
          order.orderStatus,
          order.paymentStatus,
          order.paymentMethod,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesFromDate = !fromDate || orderDate >= new Date(fromDate);
      const matchesToDate =
        !toDate || orderDate <= new Date(`${toDate}T23:59:59`);

      return (
        matchesStatus &&
        matchesPayment &&
        matchesSearch &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [activeStatus, orders, paymentFilter, searchQuery, fromDate, toDate]);

  const totalPages = data?.data.meta?.totalPages ?? 1;

  const handleOrderStatusChange = (
    orderId: string,
    nextStatus: OrderStatus,
  ) => {
    // optimistic update
    setOrderOverrides((currentOverrides) => {
      const currentOrder =
        currentOverrides[orderId] ??
        orders.find((order) => order.id === orderId);

      if (!currentOrder) {
        return currentOverrides;
      }

      return {
        ...currentOverrides,
        [orderId]: { ...currentOrder, orderStatus: nextStatus },
      };
    });

    // map dashboard status to API status
    const dashboardToApiStatus: Record<string, string> = {
      "قيد الانتظار": "Pending",
      "تم الشحن": "Shipped",
      "تم التوصيل": "Delivered",
      مكتمل: "Delivered",
      ملغي: "Cancelled",
      "جاري التجهيز": "Pending",
      "جاهز للشحن": "Pending",
    };

    const apiStatus = (dashboardToApiStatus[nextStatus] ??
      "Pending") as EOrderStatus;

    updateOrderStatus({
      id: orderId,
      status: apiStatus as unknown as typeof EOrderStatus,
    })
      .then(() => {
        showNotification({
          message: `تم تغيير حالة الطلب ${orderId} إلى "${nextStatus}".`,
          variant: "success",
        });
      })
      .catch((err) => {
        // revert optimistic change on error
        setOrderOverrides((currentOverrides) => {
          const original = apiOrders.find((o) => o.id === orderId);
          if (!original) return currentOverrides;
          return { ...currentOverrides, [orderId]: original };
        });

        console.error("Failed to update order status", err);
        showNotification({
          message: `تعذر تغيير حالة الطلب ${orderId}.`,
          variant: "error",
        });
      });
  };

  const handlePrintInvoice = async (order: IOrder | Order) => {
    try {
      const dashboardToIOrder = (o: Order): IOrder => {
        // try to parse numeric total from formatted string (e.g. "$123.45")
        const parsedTotal =
          Number(String(o.total).replace(/[^0-9.-]+/g, "")) || 0;

        const mapStatus = (s: Order["orderStatus"]): EOrderStatus => {
          switch (s) {
            case "تم الشحن":
              return EOrderStatus.Shipped;
            case "تم التوصيل":
              return EOrderStatus.Delivered;
            case "ملغي":
              return EOrderStatus.Cancelled;
            default:
              return EOrderStatus.Pending;
          }
        };

        const mapPayment = (p: Order["paymentStatus"]): EPaymentStatus =>
          p === "مدفوع" ? EPaymentStatus.Success : EPaymentStatus.Pending;

        return {
          id: o.id,
          totalAmount: parsedTotal,
          createdAt: o.date,
          paymentStatus: mapPayment(o.paymentStatus),
          status: mapStatus(o.orderStatus),
          orderItems: [],
          customer: { id: "", name: o.customer ?? "Customer", email: "" },
          store: {
            id: storeId ?? "",
            name: userStoreData?.data.store?.name ?? "",
            subdomain: "",
            ownerId: "",
          },
        } as unknown as IOrder;
      };

      const printableOrder: IOrder =
        "totalAmount" in order
          ? (order as IOrder)
          : dashboardToIOrder(order as Order);

      await generateInvoicePdf(printableOrder, {
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
  // const statusCounts = useMemo(() => buildStatusCounts(orders), [orders]);

  const totalPending = pendingQuery.data?.data.meta?.total;
  // pendingQuery.data?.data.meta?.total ?? statusCounts.pending;
  const totalShipped = shippedQuery.data?.data.meta?.total;
  // shippedQuery.data?.data.meta?.total ?? statusCounts.shipped;
  const totalDelivered = deliveredQuery.data?.data.meta?.total;
  // deliveredQuery.data?.data.meta?.total ?? statusCounts.delivered;
  const totalCancelled = cancelledQuery.data?.data.meta?.total;
  // cancelledQuery.data?.data.meta?.total ?? statusCounts.canceled;

  const totalAll =
    (totalPending ?? 0) +
    (totalShipped ?? 0) +
    (totalDelivered ?? 0) +
    (totalCancelled ?? 0);
  console.log(totalAll);
  const statusCountsAll: StatusCounts = {
    all: totalAll,
    pending: totalPending ?? 0,
    shipped: totalShipped ?? 0,
    canceled: totalCancelled ?? 0,
    delivered: totalDelivered ?? 0,
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <DashboardCard
        title={` إدارة الطلبات `}
        icon={<ShoppingBag className="w-6 h-6 text-primary" />}
        headerAction={
          <div className="overflow-x-auto px-2">
            <div className="inline-flex items-center gap-2 whitespace-nowrap py-2">
              {statusFilters.map((filter) => {
                const isActive = activeStatus === filter.key;
                return (
                  <Button
                    variant={isActive ? "primary" : "outline-accent"}
                    className="inline-flex shrink-0 w-30! h-10! border-gray-200! text-sm!"
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      setActiveStatus(filter.key);
                      setPage(1);
                    }}
                    icon={
                      <span
                        className={clsx(
                          "px-2 py-0.5 rounded-full text-xs inline-flex items-center justify-center transition-colors duration-150",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        {statusCountsAll[filter.countKey]}
                      </span>
                    }
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        }
      >
        <OrdersFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          paymentFilter={paymentFilter}
          setPaymentFilter={(v) => setPaymentFilter(v as PaymentFilter)}
          setPage={setPage}
        />
        {/* Table */}
        <div className="last:pb-6 p-0">
          <OrdersMobileList
            orders={filteredOrders}
            isLoading={isLoading}
            isError={isError}
            onView={setSelectedOrder}
            onPrint={handlePrintInvoice}
            onChangeStatus={handleOrderStatusChange}
          />

          {/* Desktop table (extracted) */}
          <OrdersTable
            orders={filteredOrders}
            isLoading={isLoading}
            isError={isError}
            onView={setSelectedOrder}
            onPrint={handlePrintInvoice}
            onChangeStatus={handleOrderStatusChange}
          />
        </div>
        {/* Pagination */}
        <div className="px-6 overflow-x-auto">
          <div className="min-w-max">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      </DashboardCard>

      {selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder.id}
          onClose={() => setSelectedOrder(null)}
          onPrint={handlePrintInvoice}
        />
      )}
    </div>
  );
};

export default Orders;
