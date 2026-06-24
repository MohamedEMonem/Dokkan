import { Link } from "react-router-dom";
import { Eye, Printer, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { EOrderStatus, EPaymentStatus, IOrder } from "@/types/entities/order.types";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface AdminOrdersTableProps {
  orders: IOrder[];
  isLoading: boolean;
  onView: (order: IOrder) => void;
  onPrint: (order: IOrder) => void;
  onChangeStatus: (orderId: string, nextStatus: EOrderStatus) => void;
}

const getOrderStatusStyles = (status: EOrderStatus) => {
  switch (status) {
    case EOrderStatus.Pending:
      return "bg-amber-500! text-white! focus:ring-amber-500!";
    case EOrderStatus.Shipped:
      return "bg-blue-500! text-white! focus:ring-blue-500!";
    case EOrderStatus.Cancelled:
      return "bg-red-500! text-white! focus:ring-red-500!";
    case EOrderStatus.Delivered:
      return "bg-emerald-500! text-white! focus:ring-emerald-500!";
    default:
      return "bg-gray-500! text-white!";
  }
};

const getStatusLabel = (status: EOrderStatus) => {
  switch (status) {
    case EOrderStatus.Pending:
      return "قيد الانتظار";
    case EOrderStatus.Shipped:
      return "تم الشحن";
    case EOrderStatus.Delivered:
      return "تم التوصيل";
    case EOrderStatus.Cancelled:
      return "ملغي";
    default:
      return status;
  }
};

export function AdminOrdersTable({
  orders,
  isLoading,
  onView,
  onPrint,
  onChangeStatus,
}: AdminOrdersTableProps) {
  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm font-sans select-none">
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-muted text-sm font-medium">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm text-center p-12 font-sans select-none">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-accent-light" />
        <h3 className="text-base font-bold text-text-dark mb-1">لا توجد طلبات مطابقة للبحث</h3>
        <p className="text-text-muted text-xs">حاول تغيير خيارات التصفية أو البحث عن كلمة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm font-sans select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b-2 border-accent-light text-text-muted bg-bg-cream/40 font-bold">
              <th className="py-3.5 px-4 w-[12%]">رقم الطلب</th>
              <th className="py-3.5 px-4 w-[16%]">العميل</th>
              <th className="py-3.5 px-4 w-[16%]">المتجر</th>
              <th className="py-3.5 px-4 w-[12%]">التاريخ</th>
              <th className="py-3.5 px-4 w-[12%]">الإجمالي</th>
              <th className="py-3.5 px-4 w-[12%]">حالة الدفع</th>
              <th className="py-3.5 px-4 w-[12%] text-center">حالة الطلب</th>
              <th className="py-3.5 px-4 w-[10%] text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const customerName = order.customer?.name || order.shippingAddress?.username || "عميل غير معروف";
              const storeName = order.store?.name || "متجر غير معروف";
              const storeSubdomain = order.store?.subdomain;
              const formattedDate = order.createdAt ? formatDate(order.createdAt) : "--";
              const formattedTotal = formatCurrency(order.totalAmount);
              
              // Get status options based on transitions rules
              let statusOptions = [{ value: order.status, label: getStatusLabel(order.status) }];
              const isLocked = order.status === EOrderStatus.Delivered || order.status === EOrderStatus.Cancelled;

              if (order.status === EOrderStatus.Pending) {
                statusOptions = [
                  { value: EOrderStatus.Pending, label: getStatusLabel(EOrderStatus.Pending) },
                  { value: EOrderStatus.Shipped, label: getStatusLabel(EOrderStatus.Shipped) },
                  { value: EOrderStatus.Cancelled, label: getStatusLabel(EOrderStatus.Cancelled) },
                ];
              } else if (order.status === EOrderStatus.Shipped) {
                statusOptions = [
                  { value: EOrderStatus.Shipped, label: getStatusLabel(EOrderStatus.Shipped) },
                  { value: EOrderStatus.Delivered, label: getStatusLabel(EOrderStatus.Delivered) },
                  { value: EOrderStatus.Cancelled, label: getStatusLabel(EOrderStatus.Cancelled) },
                ];
              }

              return (
                <tr key={order.id} className="hover:bg-bg-cream/10 transition-colors">
                  {/* Order ID column */}
                  <td className="py-4 px-4 font-medium">
                    <button
                      onClick={() => onView(order)}
                      className="text-primary hover:text-primary-dark font-medium hover:underline text-[13px] text-right font-mono"
                    >
                      #{order.id.trim().slice(-6).toUpperCase()}
                    </button>
                  </td>

                  {/* Customer column */}
                  <td className="py-4 px-4 text-text-dark font-medium">
                    {customerName}
                  </td>

                  {/* Store Name column */}
                  <td className="py-4 px-4 font-medium">
                    {storeSubdomain ? (
                      <Link
                        to={`/${storeSubdomain}`}
                        className="text-text-dark hover:text-primary transition-colors block truncate max-w-40"
                      >
                        {storeName}
                      </Link>
                    ) : (
                      <span className="text-text-muted">{storeName}</span>
                    )}
                  </td>

                  {/* Date column */}
                  <td className="py-4 px-4 text-text-muted font-medium">
                    {formattedDate}
                  </td>

                  {/* Total column */}
                  <td className="py-4 px-4 font-bold text-primary">
                    {formattedTotal}
                  </td>

                  {/* Payment Status column */}
                  <td className="py-4 px-4">
                    <span
                      className={clsx(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                        order.paymentStatus === EPaymentStatus.Success
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                          : order.paymentStatus === EPaymentStatus.Failed
                          ? "text-red-600 bg-red-50 border-red-100"
                          : "text-amber-600 bg-amber-50 border-amber-100"
                      )}
                    >
                      {order.paymentStatus === EPaymentStatus.Success
                        ? "مدفوع"
                        : order.paymentStatus === EPaymentStatus.Failed
                        ? "فشل الدفع"
                        : "قيد الانتظار"}
                    </span>
                  </td>

                  {/* Order Status column */}
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <Select
                        id={`order-status-${order.id}`}
                        aria-label={`تغيير حالة الطلب ${order.id}`}
                        disabled={isLocked}
                        options={statusOptions}
                        className={clsx(
                          "w-30! h-9! text-xs! rounded-lg! border-0! font-semibold cursor-pointer! disabled:opacity-90 disabled:cursor-not-allowed",
                          getOrderStatusStyles(order.status)
                        )}
                        value={order.status}
                        onChange={(event) => {
                          const nextStatus = event.target.value as EOrderStatus;
                          onChangeStatus(order.id, nextStatus);
                        }}
                      />
                    </div>
                  </td>

                  {/* Actions column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="outline-accent"
                        icon={<Eye className="w-4 h-4" />}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-bg-cream rounded-md transition-colors border-none"
                        title="عرض تفاصيل الطلب"
                        type="button"
                        onClick={() => onView(order)}
                      />
                      <Button
                        variant="outline-accent"
                        icon={<Printer className="w-4 h-4" />}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-bg-cream rounded-md transition-colors border-none"
                        title="طباعة الفاتورة"
                        type="button"
                        onClick={() => onPrint(order)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
