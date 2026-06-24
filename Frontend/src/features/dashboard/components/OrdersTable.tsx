import clsx from "clsx";
import { Eye, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatDate } from "@/utils/formatDate";
import { DashboardOrder } from "../Orders";



export type OrderStatus = DashboardOrder["orderStatus"];

const orderStatusOptions: OrderStatus[] = [
  "قيد الانتظار",
  "تم الشحن",
  "جاهز للشحن",
  "ملغي",
  "جاري التجهيز",
  "تم التوصيل",
  "مكتمل",
];

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

type Props = {
  orders: DashboardOrder[];
  isLoading: boolean;
  isError: boolean;
  onView: (order: DashboardOrder) => void;
  onPrint: (order: DashboardOrder) => void;
  onChangeStatus: (orderId: string, nextStatus: OrderStatus) => void;
};

function OrderTableRow({
  order,
  onView,
  onPrint,
  onChangeStatus,
}: {
  order: DashboardOrder;
  onView: (order: DashboardOrder) => void;
  onPrint: (order: DashboardOrder) => void;
  onChangeStatus: (orderId: string, nextStatus: OrderStatus) => void;
}) {
  return (
    <tr
      key={order.id}
      className="data-[state=selected]:bg-muted border-b border-accent-light hover:bg-bg-cream/30 transition-colors h-12"
    >
      <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 py-3 align-middle px-4">
        <Link
          to={`/orders/${order.id}`}
          className="text-primary hover:text-primary-dark font-medium hover:underline text-[20px]"
        >
          <span dir="ltr" className="inline-block">
            #{order.id.trim().slice(-6)}
          </span>
        </Link>
      </td>
      <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 py-3 text-center align-middle px-4">
        <span className="text-sm text-text-dark font-medium">
          {order.customer}
        </span>
      </td>
      <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-sm text-text-muted py-3 align-middle px-4">
        {formatDate(order.date)}
      </td>
      <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 text-sm font-semibold text-primary py-3 align-middle px-4">
        {order.total}
      </td>
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
      <td className="p-2 whitespace-nowrap text-sm py-3 align-middle px-4 text-right">
        <span className="text-sm text-text-dark">{order.paymentMethod}</span>
      </td>
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
              const nextStatus = event.target.value as OrderStatus;
              onChangeStatus(order.id, nextStatus);
            }}
          />
        </div>
      </td>
      <td className="p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 py-3 align-middle px-4">
        <div className="flex items-center justify-center gap-0.5">
          <Button
            variant="outline-accent"
            icon={<Eye className="w-4 h-4" />}
            className="p-2 w-10! border-none text-black"
            title="عرض التفاصيل"
            type="button"
            onClick={() => onView(order)}
          />
          <Button
            variant="outline-accent"
            icon={<Printer className="w-4 h-4" />}
            className="p-2 w-10! border-none text-black"
            title="طباعة الفاتورة"
            onClick={() => onPrint(order)}
            type="button"
          />
        </div>
      </td>
    </tr>
  );
}

export default function OrdersTable({
  orders,
  isLoading,
  isError,
  onView,
  onPrint,
  onChangeStatus,
}: Props) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <div className="relative w-full overflow-x-auto">
        <table className="caption-bottom text-sm table-fixed w-full">
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
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-text-muted">
                  جاري تحميل الطلبات...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-red-600">
                  تعذر تحميل الطلبات من الخادم.
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-text-muted">
                  لا توجد طلبات مطابقة للبحث أو الفلاتر الحالية.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onView={onView}
                  onPrint={onPrint}
                  onChangeStatus={onChangeStatus}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
