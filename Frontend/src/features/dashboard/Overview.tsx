import { useMemo } from "react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { TrendingUp, ShoppingBag, Package, ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useGetUserStoreQuery, useGetStoreAnalyticsQuery } from "@/api/store.api";
import { useGetOrdersByStoreIdQuery } from "@/api/order.api";
import { useGetProductsByStoreIdQuery } from "@/api/product.api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipContentProps,
} from "recharts";

const getOrderStatusStyles = (status: string) => {
  switch (status) {
    case "Pending":
    case "قيد الانتظار":
      return "bg-amber-500 text-white";
    case "Shipped":
    case "تم الشحن":
      return "bg-blue-500 text-white";
    case "Delivered":
    case "تم التوصيل":
      return "bg-emerald-500 text-white";
    case "Cancelled":
    case "ملغي":
      return "bg-red-500 text-white";
    default:
      return "bg-accent-light/30 text-primary";
  }
};

const formatStatusLabel = (status: string) => {
  switch (status) {
    case "Pending":
      return "قيد الانتظار";
    case "Shipped":
      return "تم الشحن";
    case "Delivered":
      return "تم التوصيل";
    case "Cancelled":
      return "ملغي";
    default:
      return status;
  }
};

const salesData = [
  { month: "يناير", sales: 4000 },
  { month: "فبراير", sales: 3500 },
  { month: "مارس", sales: 5000 },
  { month: "أبريل", sales: 4500 },
  { month: "مايو", sales: 6000 },
  { month: "يونيو", sales: 7500 },
];

function SalesTooltip({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border-2 border-accent-light rounded-xl px-3.5 py-2.5 rtl font-inherit">
      <p className="m-0 font-semibold text-text-dark">{label}</p>
      <p className="mt-1 m-0 text-primary">
        {payload[0].value?.toLocaleString("en-US")} ج.م
      </p>
    </div>
  );
}

export function Overview() {
  const navigate = useNavigate();

  const { data: storeResponse } = useGetUserStoreQuery();
  const storeId = storeResponse?.data?.store?.id;

  const { data: analyticsResponse, isLoading: isAnalyticsLoading } = useGetStoreAnalyticsQuery();
  const { data: ordersResponse, isLoading: isOrdersLoading } = useGetOrdersByStoreIdQuery(
    { storeId: storeId!, limit: 5, sortBy: "createdAt", sortDir: "desc" },
    { skip: !storeId }
  );
  const { data: storeProductsResponse } = useGetProductsByStoreIdQuery(storeId!, { skip: !storeId });

  const orders = ordersResponse?.data?.orders || [];
  const storeProducts = storeProductsResponse?.data?.products || [];
  const analytics = (analyticsResponse as any)?.data || analyticsResponse;
  const topProducts = analytics?.topProducts || [];

  const productMap = useMemo(() => {
    const map = new Map<string, any>();
    storeProducts.forEach((p) => map.set(p.id, p));
    return map;
  }, [storeProducts]);

  return (
    <div className="space-y-6 w-full">
      {/* Sales Growth Card */}
      <DashboardCard
        title="نمو المبيعات - آخر 6 أشهر"
        icon={<TrendingUp className="w-6 h-6 text-primary" />}
      >
        <ResponsiveContainer width="100%" height={300} style={{ direction: "ltr" }}>
          <LineChart data={salesData} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EBD8B7" />
            <XAxis
              dataKey="month"
              stroke="#6B6B6B"
              tick={{ fill: "#6B6B6B", fontSize: 15 }}
              axisLine={{ stroke: "#6B6B6B" }}
              tickLine={{ stroke: "#6B6B6B" }}
            />
            <YAxis
              orientation="left"
              width={60}
              stroke="#6B6B6B"
              tick={{ fill: "#6B6B6B", fontSize: 15 }}
              axisLine={{ stroke: "#6B6B6B" }}
              tickLine={{ stroke: "#6B6B6B" }}
              domain={[0, 8000]}
              ticks={[0, 2000, 4000, 6000, 8000]}
            />
            <Tooltip content={<SalesTooltip />} />
            <Line
              type="monotone"
              dataKey="sales"
              name="المبيعات (ج.م)"
              stroke="#005B7F"
              strokeWidth={3}
              dot={{ r: 3, stroke: "#005B7F", strokeWidth: 3, fill: "#fff" }}
              activeDot={{ r: 5, fill: "#005B7F" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardCard>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Latest Orders Card */}
        <DashboardCard
          title="أحدث الطلبات"
          icon={<ShoppingBag className="w-6 h-6 text-primary" />}
          headerAction={
            <Button
              variant="tertiary"
              className="text-primary hover:text-primary-dark px-3 h-8! text-sm gap-1"
              onClick={() => navigate("/dashboard/orders")}
            >
              عرض الكل <ChevronLeft className="w-4 h-4" />
            </Button>
          }
          className="h-full"
        >
          {isOrdersLoading ? (
            <div className="p-8 text-center text-text-muted">جاري التحميل...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-accent-light" />
              <p>لا توجد طلبات حتى الآن</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/dashboard/orders"
                        className="font-semibold text-primary hover:underline text-sm"
                      >
                        طلب #{order.id.trim().slice(-6)}
                      </Link>
                      <span
                        className={clsx(
                          "text-xs px-2.5 py-0.5 rounded-full font-medium shadow-xs",
                          getOrderStatusStyles(order.status)
                        )}
                      >
                        {formatStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("ar-EG") : ""}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary text-sm">
                      {Math.round(Number(order.totalAmount || 0)).toLocaleString("en-US")} ج.م
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Top Products Card */}
        <DashboardCard
          title="المنتجات الأكثر مبيعاً"
          icon={<TrendingUp className="w-6 h-6 text-accent" />}
          headerAction={
            <Button
              variant="tertiary"
              className="text-primary hover:text-primary-dark px-3 h-8! text-sm gap-1"
              onClick={() => navigate("/dashboard/products")}
            >
              عرض الكل <ChevronLeft className="w-4 h-4" />
            </Button>
          }
          className="h-full"
        >
          {isAnalyticsLoading ? (
            <div className="p-8 text-center text-text-muted">جاري التحميل...</div>
          ) : topProducts.length === 0 ? (
            <div className="p-8 text-center text-text-muted flex flex-col items-center justify-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-accent-light" />
              <p className="mb-4">لا توجد منتجات مبيعة حتى الآن</p>
              <Button
                variant="primary"
                className="w-auto! px-4 py-2 text-sm"
                icon={<Plus className="w-4 h-4 ml-2" />}
                onClick={() => navigate("/dashboard/products")}
              >
                إضافة أو استعراض المنتجات
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {topProducts.slice(0, 5).map((item: any, idx: number) => {
                const pId = item.product?.id || item.productId;
                const matchedProduct = productMap.get(pId) || item.product;
                const title = matchedProduct?.title || item.product?.title || item.title || "منتج";
                const units = item.unitsSold ?? item.totalQuantity ?? 0;
                const price = matchedProduct?.price ? Number(matchedProduct.price) : (item.product?.price ? Number(item.product.price) : 0);
                const imageUrl = matchedProduct?.images?.[0]?.imageUrl || matchedProduct?.images?.[0];

                return (
                  <div key={pId || idx} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-10 h-10 rounded-xl object-cover border border-accent-light/40 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-accent-light/30 flex items-center justify-center text-primary shrink-0">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <Link
                          to="/dashboard/products"
                          className="font-semibold text-text-dark hover:text-primary hover:underline text-sm truncate max-w-44 md:max-w-60 block"
                        >
                          {title}
                        </Link>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-accent-light/30 text-primary inline-block mt-1">
                          {units} قطعة
                        </span>
                      </div>
                    </div>
                    {price > 0 && (
                      <div className="text-left">
                        <p className="font-bold text-primary text-sm">
                          {Math.round(price).toLocaleString("en-US")} ج.م
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
