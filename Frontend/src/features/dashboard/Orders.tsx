import { useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import { Eye, Printer, Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { showNotification } from "@/utils/showNotification";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Pagination } from "@/components/ui/Pagination";

type OrderStatus =
  | "قيد الانتظار"
  | "تم الشحن"
  | "جاهز للشحن"
  | "ملغي"
  | "جاري التجهيز"
  | "تم التوصيل"
  | "مكتمل";
type PaymentStatus = "مدفوع" | "غير مدفوع";
type PaymentFilter = "الكل" | PaymentStatus;

type Order = {
  id: string;
  customer: string;
  date: string;
  total: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  orderStatus: OrderStatus;
};

const mockOrders: Order[] = [
  {
    id: "ORD-4520",
    customer: "أحمد محمد",
    date: "2025-11-20",
    total: "1,250 ج.م",
    paymentStatus: "مدفوع",
    paymentMethod: "Credit Card",
    orderStatus: "مكتمل",
  },
  {
    id: "ORD-4521",
    customer: "سارة علي",
    date: "2025-11-20",
    total: "890 ج.م",
    paymentStatus: "غير مدفوع",
    paymentMethod: "Cash",
    orderStatus: "قيد الانتظار",
  },
  {
    id: "ORD-4522",
    customer: "محمد حسن",
    date: "2025-11-19",
    total: "2,340 ج.م",
    paymentStatus: "مدفوع",
    paymentMethod: "PayPal",
    orderStatus: "تم الشحن",
  },
  {
    id: "ORD-4523",
    customer: "فاطمة أحمد",
    date: "2025-11-19",
    total: "670 ج.م",
    paymentStatus: "مدفوع",
    paymentMethod: "Apple Pay",
    orderStatus: "تم التوصيل",
  },
  {
    id: "ORD-4524",
    customer: "عمر خالد",
    date: "2025-11-18",
    total: "1,890 ج.م",
    paymentStatus: "مدفوع",
    paymentMethod: "Credit Card",
    orderStatus: "قيد الانتظار",
  },
];

type FilterStatus = "الكل" | OrderStatus;

type StatusCounts = {
  all: number;
  pending: number;
  shipped: number;
  completed: number;
  canceled: number;
};

const statusFilters: Array<{
  key: FilterStatus;
  label: string;
  countKey: keyof StatusCounts;
}> = [
  { key: "الكل", label: "الكل", countKey: "all" },
  { key: "قيد الانتظار", label: "قيد الانتظار", countKey: "pending" },
  { key: "تم الشحن", label: "تم الشحن", countKey: "shipped" },
  { key: "مكتمل", label: "مكتمل", countKey: "completed" },
  { key: "ملغي", label: "ملغي", countKey: "canceled" },
];

const orderStatusOptions: OrderStatus[] = [
  "قيد الانتظار",
  "تم الشحن",
  "جاهز للشحن",
  "ملغي",
  "جاري التجهيز",
  "تم التوصيل",
  "مكتمل",
];

const buildStatusCounts = (orders: Order[]) => ({
  all: orders.length,
  pending: orders.filter((order) => order.orderStatus === "قيد الانتظار")
    .length,
  shipped: orders.filter((order) => order.orderStatus === "تم الشحن").length,
  completed: orders.filter((order) => order.orderStatus === "مكتمل").length,
  canceled: orders.filter((order) => order.orderStatus === "ملغي").length,
});

const getOrderStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case "قيد الانتظار":
      return "bg-amber-500! text-white! focus:ring-amber-500!";
    case "تم الشحن":
      return "bg-blue-500! text-white! focus:ring-blue-500!";
    case "ملغي":
      return "bg-red-500! text-white! focus:ring-red-500!";
    case "جاري التجهيز":
      return "bg-yellow-500! text-white! focus:ring-yellow-500!";
    case "جاهز للشحن":
      return "bg-cyan-500! text-white! focus:ring-cyan-500!";
    case "تم التوصيل":
      return "bg-green-500! text-white! focus:ring-green-500!";
    case "مكتمل":
      return "bg-emerald-500! text-white! focus:ring-emerald-500!";
  }
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

const Orders = () => {
  const [activeStatus, setActiveStatus] = useState<FilterStatus>("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("الكل");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orders, setOrders] = useState(mockOrders);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

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

  // reset to first page when filters change
  useEffect(() => setPage(1), [filteredOrders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  const handleOrderStatusChange = (
    orderId: string,
    nextStatus: OrderStatus,
  ) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: nextStatus } : order,
      ),
    );
    showNotification({
      message: `تم تغيير حالة الطلب ${orderId} إلى "${nextStatus}".`,
      variant: "success",
    });
  };
  const statusCounts = useMemo(() => buildStatusCounts(orders), [orders]);
  console.log("statusCounts: ", statusCounts);
  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-accent-light shadow-lg"> */}
      {/* Status Filters */}
      {/* <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 border-b-2 border-accent-light bg-linear-to-l from-bg-cream to-white">
          <h4 className="leading-none flex items-center gap-2 text-text-dark mb-4">
            <ShoppingBag className="w-6 h-6 text-primary" />
            إدارة الطلبات
          </h4>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusFilters.map((filter) => {
              const isActive = activeStatus === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveStatus(filter.key)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all flex items-center gap-2",
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "bg-bg-cream text-text-dark hover:bg-accent-light",
                  )}
                >
                  {filter.label}
                  <span
                    className={clsx(
                      "px-2 py-0.5 rounded-full text-xs",
                      isActive ? "bg-white/20" : "bg-primary/10 text-primary",
                    )}
                  >
                    {statusCounts[filter.countKey]}
                  </span>
                </button>
              );
            })}
          </div>
        </div> */}
      <DashboardCard
        title=" إدارة الطلبات"
        icon={<ShoppingBag className="w-6 h-6 text-primary" />}
        headerAction={
          <div className="flex flex-wrap gap-2 pb-2 max-h-20 overflow-auto px-2 transition-all duration-300 ease-in-out">
            {statusFilters.map((filter) => {
              const isActive = activeStatus === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveStatus(filter.key)}
                  className={clsx(
                    "px-3 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-2 min-w-[8rem] justify-between transform-gpu",
                    isActive
                      ? "bg-primary text-white shadow-md transition-colors duration-200 ease-in-out"
                      : "bg-bg-cream text-text-dark hover:bg-accent-light transition-colors duration-200 ease-in-out hover:scale-105",
                  )}
                >
                  <span className="flex-1 text-right pr-1">{filter.label}</span>
                  <span
                    className={clsx(
                      "px-2 py-0.5 rounded-full text-xs inline-flex items-center justify-center transition-colors duration-150",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {statusCounts[filter.countKey]}
                  </span>
                </button>
              );
            })}
          </div>
        }
      >
        {/* Date Filters */}
        <div className="px-6 py-4 border-b border-accent-light bg-linear-to-l from-bg-cream to-white">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-62.5">
              <div className="relative">
                <Input
                  icon={<Search className="w-4 h-4 text-text-muted" />}
                  placeholder="رقم الطلب، اسم العميل، أو المنتج..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-text-muted whitespace-nowrap">
                من:
              </span>
              <Input
                type="date"
                aria-label="من تاريخ"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
              />
              <span className="text-sm text-text-muted">إلى:</span>
              <Input
                type="date"
                aria-label="إلى تاريخ"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
              />
            </div>

            <Select
              options={[
                { label: "كل حالات الدفع", value: "الكل" },
                { label: "مدفوع", value: "مدفوع" },
                { label: "غير مدفوع", value: "غير مدفوع" },
              ]}
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(event.target.value as PaymentFilter)
              }
            ></Select>
          </div>
        </div>
        {/* Table */}
        <div className="last:pb-6 p-0">
          <div className="overflow-x-auto">
            <div className="relative w-full overflow-x-auto">
              <table className="caption-bottom text-sm table-fixed w-full">
                {/* Table Header */}
                <thead className="[&_tr]:border-b">
                  <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors border-accent-light bg-bg-cream">
                    <th className="text-foreground font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-right w-[13%] align-middle h-12 px-4">
                      رقم الطلب
                    </th>
                    <th className="text-foreground font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-center w-[16%] align-middle h-12 px-4">
                      العميل
                    </th>
                    <th className="text-foreground font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-right w-[13%] align-middle h-12 px-4">
                      التاريخ
                    </th>
                    <th className="text-foreground font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-right w-[13%] align-middle h-12 px-4">
                      الإجمالي
                    </th>
                    <th className="text-foreground font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-right w-[13%] align-middle h-12 px-4">
                      حالة الدفع
                    </th>
                    <th className="text-foreground font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-right w-[13%] align-middle h-12 px-4">
                      طريقة الدفع
                    </th>
                    <th className="text-foreground font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-center w-[19%] align-middle h-12 px-4">
                      حالة الطلب
                    </th>
                    <th className="text-foreground font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-center w-[13%] align-middle h-12 px-4">
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody className="[&_tr:last-child]:border-0">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-10 text-center text-text-muted"
                      >
                        لا توجد طلبات مطابقة للبحث أو الفلاتر الحالية.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="data-[state=selected]:bg-muted border-b border-accent-light hover:bg-bg-cream/30 transition-colors h-12"
                      >
                        {/* Order ID */}
                        <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 py-3 align-middle px-4">
                          <Link
                            to={`/orders/${order.id}`}
                            className="text-primary hover:text-primary-dark font-medium hover:underline text-[20px]"
                          >
                            #{order.id}
                          </Link>
                        </td>
                        {/* Customer Name */}
                        <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 py-3 text-center align-middle px-4">
                          <span className="text-sm text-text-dark font-medium">
                            {order.customer}
                          </span>
                        </td>
                        {/* Order Date */}
                        <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-sm text-text-muted py-3 align-middle px-4">
                          {formatDate(order.date)}
                        </td>
                        {/* Total Amount */}
                        <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-sm font-semibold text-primary py-3 align-middle px-4">
                          {order.total}
                        </td>
                        {/* Payment Status */}
                        <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 py-3 align-middle px-4">
                          <span
                            className={clsx(
                              "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden border-transparent text-white",
                              order.paymentStatus === "مدفوع"
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-red-500 hover:bg-red-600",
                            )}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        {/* Payment Method */}
                        <td className="p-2 whitespace-nowrap text-sm py-3 align-middle px-4 text-right">
                          <span className="text-sm text-text-dark">
                            {order.paymentMethod}
                          </span>
                        </td>
                        {/* Order Status */}
                        <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 py-3 align-middle px-4">
                          <div className="flex justify-center">
                            <Select
                              id={`order-status-${order.id}`}
                              aria-label={`تغيير حالة الطلب ${order.id}`}
                              options={orderStatusOptions.map((status) => ({
                                label: status,
                                value: status,
                              }))}
                              className={clsx(
                                "w-30! h-9! text-xs! rounded-lg! border-0! cursor-pointer! ",
                                getOrderStatusStyles(order.orderStatus),
                              )}
                              value={order.orderStatus}
                              onChange={(event) => {
                                const nextStatus = event.target
                                  .value as OrderStatus;
                                handleOrderStatusChange(order.id, nextStatus);
                              }}
                            />
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 py-3 align-middle px-4">
                          <div className="flex items-center justify-center ">
                            <Button
                              variant="outline-accent"
                              icon={<Eye className="w-4 h-4" />}
                              className="p-2 w-10! border-none text-black"
                              title="عرض التفاصيل"
                              type="button"
                            ></Button>
                            <Button
                              variant="outline-accent"
                              icon={<Printer className="w-4 h-4" />}
                              className="p-2 w-10! border-none text-black"
                              title="طباعة الفاتورة"
                              type="button"
                            ></Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardCard>
      {/* </div> */}
    </div>
  );
};

export default Orders;
