import React from "react";
import clsx from "clsx";
import { Eye, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatDate } from "@/utils/formatDate";

type DashboardOrder = {
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

type Props = {
  orders: DashboardOrder[];
  isLoading: boolean;
  isError: boolean;
  onView: (order: DashboardOrder) => void;
  onPrint: (order: DashboardOrder) => void;
  onChangeStatus: (
    orderId: string,
    nextStatus: DashboardOrder["orderStatus"],
  ) => void;
};

export default function OrdersMobileList({
  orders,
  isLoading,
  isError,
  onView,
  onPrint,
  onChangeStatus,
}: Props) {
  return (
    <div className="block md:hidden p-4 space-y-3">
      {isLoading ? (
        <div className="py-10 text-center text-text-muted">
          جاري تحميل الطلبات...
        </div>
      ) : isError ? (
        <div className="py-10 text-center text-red-600">
          تعذر تحميل الطلبات من الخادم.
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center text-text-muted">
          لا توجد طلبات مطابقة للبحث أو الفلاتر الحالية.
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-accent-light p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <Link
                to={`/orders/${order.id}`}
                className="text-primary font-medium text-base hover:underline"
              >
                <span dir="ltr">#{order.id.trim().slice(-6)}</span>
              </Link>
              <div className="flex items-center gap-2">
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
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-text-muted">
              <div>
                <div className="text-xs text-text-muted">العميل</div>
                <div className="font-medium text-text-dark">
                  {order.customer}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">التاريخ</div>
                <div>{formatDate(order.date)}</div>
              </div>

              <div>
                <div className="text-xs text-text-muted">الإجمالي</div>
                <div className="font-semibold text-primary">{order.total}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">حالة الدفع</div>
                <div>
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
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-xs text-text-muted">حالة الطلب</div>
                <div className="mt-1">
                  <Select
                    id={`order-status-mobile-${order.id}`}
                    aria-label={`تغيير حالة الطلب ${order.id}`}
                    options={[
                      { label: "قيد الانتظار", value: "قيد الانتظار" },
                      { label: "تم الشحن", value: "تم الشحن" },
                      { label: "جاهز للشحن", value: "جاهز للشحن" },
                      { label: "ملغي", value: "ملغي" },
                      { label: "جاري التجهيز", value: "جاري التجهيز" },
                      { label: "تم التوصيل", value: "تم التوصيل" },
                      { label: "مكتمل", value: "مكتمل" },
                    ]}
                    className={clsx(
                      "w-full text-sm rounded-lg border-0 cursor-pointer",
                    )}
                    value={order.orderStatus}
                    onChange={(event) =>
                      onChangeStatus(order.id, event.target.value as any)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
