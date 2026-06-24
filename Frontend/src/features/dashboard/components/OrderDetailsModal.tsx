import { clsx } from "clsx";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Calendar,
  CreditCard,
  Download,
  MapPin,
  Package,
  Store,
  User,
  X,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { IOrder } from "@/types/entities/order.types";
import { useGetOrderByIdQuery } from "@/api/order.api";
import { Button } from "@/components/ui/Button";
import { QRCodeSVG } from "qrcode.react";
import { formatCurrency } from "@/utils/formatCurrency";

const getInvoiceNumber = (orderId: string) => {
  const normalized = orderId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  return `#${(normalized || orderId).toUpperCase()}`;
};

const getStatusMeta = (status?: string) => {
  switch (status) {
    case "Delivered":
      return {
        label: "Delivered",
        className: "bg-linear-to-r from-emerald-500 to-green-500",
      };
    case "Shipped":
      return {
        label: "Shipped",
        className: "bg-linear-to-r from-sky-500 to-blue-500",
      };
    case "Cancelled":
      return {
        label: "Cancelled",
        className: "bg-linear-to-r from-rose-500 to-red-500",
      };
    default:
      return {
        label: "Pending",
        className: "bg-linear-to-r from-yellow-400 to-orange-400",
      };
  }
};

const getPaymentMeta = (status?: string) => {
  switch (status) {
    case "Success":
      return {
        label: "Success",
        className: "bg-linear-to-r from-emerald-500 to-green-400",
      };
    case "Failed":
      return {
        label: "Failed",
        className: "bg-linear-to-r from-rose-500 to-red-500",
      };
    default:
      return {
        label: "Pending",
        className: "bg-linear-to-r from-yellow-400 to-orange-400",
      };
  }
};

function InfoCard({
  icon,
  title,
  accentClassName,
  primary,
  secondary,
}: {
  icon: ReactNode;
  title: string;
  accentClassName: string;
  primary: string;
  secondary?: string;
}) {
  return (
    <div className={clsx("rounded-xl border p-4", accentClassName)}>
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded-lg bg-slate-900/90 p-1.5 text-white">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="font-medium text-gray-900">{primary}</p>
      {secondary ? <p className="text-sm text-gray-600">{secondary}</p> : null}
    </div>
  );
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm",
        className,
      )}
    >
      {label}
    </span>
  );
}

type OrderDetailsModalProps = {
  orderId: string;
  onClose: () => void;
  onPrint: (order: IOrder) => void | Promise<void>;
};

function OrderDetailsModal({
  orderId,
  onClose,
  onPrint,
}: OrderDetailsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const order = data?.data.order;
  const orderItems = order?.orderItems ?? [];
  const shippingAddress = order?.shippingAddress;
  const customerName =
    order?.customer?.name ?? shippingAddress?.username ?? "Customer";
  const customerEmail = order?.customer?.email ?? shippingAddress?.email ?? "";
  const storeName = order?.store?.name ?? "Urban Hub";
  const storeDomain = order?.store?.subdomain ?? "urbanhub.store";
  const invoiceNumber = order?.id ? getInvoiceNumber(order.id) : "#INV";
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.priceAtPurchase,
    0,
  );
  const shippingCost = order?.shippingCost ?? 0;
  const taxAmount = order?.taxAmount ?? 0;
  const totalAmount = order?.totalAmount ?? subtotal + shippingCost + taxAmount;
  const statusMeta = getStatusMeta(order?.status);
  const paymentMeta = getPaymentMeta(order?.paymentStatus);
  const invoiceDate = order?.createdAt ? formatDate(order.createdAt) : "--";

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 220);
  }, [onClose]);

  const handleDownloadPdf = () => {
    if (!order) return;

    void onPrint(order as unknown as IOrder);
  };

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-invoice-title"
    >
      <div
        className={clsx(
          "absolute inset-0 backdrop-blur-sm transition-opacity duration-200",
          isVisible ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0",
        )}
        onClick={handleClose}
      />

      <div
        className={clsx(
          "relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl transition-all duration-200",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        )}
        style={{ transformOrigin: "center" }}
      >
        {/* <Button
         className="w-10! h-10! border-none"
         variant="outline-accent"
          type="button"
          onClick={handleClose}
          // className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
          icon={<X className="size-5" />}
        ></Button> */}

        {isError ? (
          <div className="p-8 text-center text-red-600">
            تعذر تحميل تفاصيل الطلب.
          </div>
        ) : (
          <div className="max-h-[92vh] overflow-y-auto">
            <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-6 pr-12">
                <div className="text-white">
                  <h1
                    id="order-invoice-title"
                    className="mb-1 text-3xl font-bold tracking-wide"
                  >
                    INVOICE
                  </h1>
                  <p className="text-indigo-100">{invoiceNumber}</p>
                </div>

                <div className="rounded-2xl bg-white p-3 shadow-lg">
                  <div className="flex size-17.5 items-center justify-center rounded-xl bg-slate-950/5 text-slate-900">
                    <QRCodeSVG
                      value={`https://dokkan/orders/${order?.id}`}
                      size={88}
                      includeMargin
                      bgColor="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-white/90">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {invoiceDate}
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="size-4" />
                  {orderItems.length} items
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 grid gap-4 lg:grid-cols-2">
                <InfoCard
                  icon={<Store className="size-4" />}
                  title="From"
                  accentClassName="border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50"
                  primary={storeName}
                  secondary={storeDomain}
                />
                <InfoCard
                  icon={<User className="size-4" />}
                  title="Bill To"
                  accentClassName="border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50"
                  primary={customerName}
                  secondary={customerEmail || undefined}
                />
              </div>

              <div className="mb-6 grid gap-4 lg:grid-cols-2">
                <InfoCard
                  icon={<MapPin className="size-4" />}
                  title="Ship To"
                  accentClassName="border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50"
                  primary={
                    shippingAddress?.line1 ??
                    shippingAddress?.city ??
                    "غير متوفر"
                  }
                  secondary={
                    shippingAddress
                      ? [shippingAddress.city, shippingAddress.postalCode]
                          .filter(Boolean)
                          .join(", ")
                      : undefined
                  }
                />

                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Order Status:</span>
                    <Badge
                      label={statusMeta.label}
                      className={statusMeta.className}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Payment:</span>
                    <Badge
                      label={paymentMeta.label}
                      className={paymentMeta.className}
                    />
                  </div>

                  <div className="grid gap-2 rounded-xl bg-linear-to-br from-slate-50 to-indigo-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Order ID
                      </p>
                      <p className="font-semibold text-gray-900">
                        {order?.id ?? "غير متوفر"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Invoice Date
                      </p>
                      <p className="font-semibold text-gray-900">
                        {invoiceDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-190">
                    <thead>
                      <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Product
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orderItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-10 text-center text-sm text-gray-500"
                          >
                            لا توجد عناصر متاحة.
                          </td>
                        </tr>
                      ) : (
                        orderItems.map((item, index) => {
                          const lineTotal =
                            item.quantity * item.priceAtPurchase;
                          const thumbnailHue = [
                            "from-indigo-500 to-purple-500",
                            "from-pink-500 to-rose-500",
                            "from-emerald-500 to-teal-500",
                            "from-amber-500 to-orange-500",
                          ][index % 4];
                          const productLabel = item.product?.title ?? "Product";
                          const initials = productLabel
                            .split(" ")
                            .slice(0, 2)
                            .map((segment) => segment.charAt(0))
                            .join("")
                            .toUpperCase();

                          return (
                            <tr
                              key={item.id}
                              className="transition-colors hover:bg-gray-50"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={clsx(
                                      "flex size-10 items-center justify-center rounded-xl bg-linear-to-br text-xs font-bold text-white shadow-sm",
                                      thumbnailHue,
                                    )}
                                  >
                                    {initials || "PR"}
                                  </div>
                                  <div>
                                    <span className="block text-sm font-medium text-gray-900">
                                      {productLabel}
                                    </span>
                                    <span className="block text-xs text-gray-500">
                                      {item.product?.id ?? item.productId}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-sm text-gray-600">
                                {formatCurrency(item.priceAtPurchase)}
                              </td>
                              <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                {formatCurrency(lineTotal)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-600">
                    Thank you for your order! 🎉
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Invoice ID: {order?.id ?? "غير متوفر"}
                  </p>
                </div>

                <div className="rounded-xl bg-linear-to-br from-gray-50 to-indigo-50 p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(taxAmount)}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          Total
                        </span>
                        <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline-accent"
                  className="w-full! h-10!"
                  icon={<Download className="size-4" />}
                  onClick={handleDownloadPdf}
                  disabled={!order || isLoading}
                >
                  Download PDF
                </Button>

                <Button
                  variant="outline-accent"
                  icon={<X className="size-4" />}
                  className="w-full! h-10!"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default OrderDetailsModal;
