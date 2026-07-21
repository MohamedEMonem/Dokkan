import { useMemo } from "react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { TrendingUp, ShoppingBag } from "lucide-react";
import { useGetStoreAnalyticsQuery } from "@/api/store.api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipContentProps,
} from "recharts";

const defaultSalesData = [
  { month: "يناير", sales: 4000 },
  { month: "فبراير", sales: 3500 },
  { month: "مارس", sales: 5000 },
  { month: "أبريل", sales: 4500 },
  { month: "مايو", sales: 6000 },
  { month: "يونيو", sales: 7500 },
];

const defaultOrdersData = [
  { month: "يناير", orders: 24 },
  { month: "فبراير", orders: 18 },
  { month: "مارس", orders: 32 },
  { month: "أبريل", orders: 28 },
  { month: "مايو", orders: 38 },
  { month: "يونيو", orders: 45 },
];

function SalesTooltip({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border-2 border-accent-light rounded-xl px-3.5 py-2.5 rtl font-inherit">
      <p className="m-0 font-semibold text-text-dark">{label}</p>
      <p className="mt-1 m-0 text-primary font-bold">
        {payload[0].value?.toLocaleString("en-US")} ج.م
      </p>
    </div>
  );
}

function OrdersTooltip({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border-2 border-accent-light rounded-xl px-3.5 py-2.5 rtl font-inherit">
      <p className="m-0 font-semibold text-text-dark">{label}</p>
      <p className="mt-1 m-0 text-accent font-bold">
        {payload[0].value?.toLocaleString("en-US")} طلب
      </p>
    </div>
  );
}

const processAnalyticsData = (rawPoints: any[]) => {
  if (!rawPoints || rawPoints.length === 0) return { salesData: [], ordersData: [] };

  const monthMap = new Map<string, { sales: number; orders: number }>();

  rawPoints.forEach((pt: any) => {
    const rawDate = pt.period || pt.date || pt.createdAt;
    if (!rawDate) return;
    const dateObj = new Date(rawDate);
    if (isNaN(dateObj.getTime())) return;

    const monthName = dateObj.toLocaleDateString("ar-EG", { month: "long" });
    const revenue = Number(pt.totalRevenue ?? pt.sales ?? pt.revenue ?? 0);
    const orderCount = Number(pt.orderCount ?? pt.orders ?? 0);

    const existing = monthMap.get(monthName) || { sales: 0, orders: 0 };
    monthMap.set(monthName, {
      sales: existing.sales + revenue,
      orders: existing.orders + orderCount,
    });
  });

  const salesData: Array<{ month: string; sales: number }> = [];
  const ordersData: Array<{ month: string; orders: number }> = [];

  monthMap.forEach((val, month) => {
    salesData.push({ month, sales: Math.round(val.sales) });
    ordersData.push({ month, orders: val.orders });
  });

  return { salesData, ordersData };
};

export function Analytics() {
  const { data: analyticsResponse, isLoading } = useGetStoreAnalyticsQuery({ granularity: "month" });

  const analytics = (analyticsResponse as any)?.data || analyticsResponse;
  const salesOverTime = analytics?.salesOverTime || [];

  const { salesData, ordersData } = useMemo(
    () => processAnalyticsData(salesOverTime),
    [salesOverTime]
  );

  const displaySalesData = salesData.length > 0 ? salesData : defaultSalesData;
  const displayOrdersData = ordersData.length > 0 ? ordersData : defaultOrdersData;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-text-muted">
        جاري تحميل بيانات التحليلات...
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Monthly Orders Line Chart */}
        <DashboardCard
          title="عدد الطلبات الشهرية"
          icon={<ShoppingBag className="w-6 h-6 text-accent" />}
        >
          <ResponsiveContainer width="100%" height={300} style={{ direction: "ltr" }}>
            <LineChart data={displayOrdersData} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBD8B7" />
              <XAxis
                dataKey="month"
                stroke="#6B6B6B"
                tick={{ fill: "#6B6B6B", fontSize: 14 }}
                axisLine={{ stroke: "#6B6B6B" }}
                tickLine={{ stroke: "#6B6B6B" }}
              />
              <YAxis
                orientation="left"
                width={50}
                stroke="#6B6B6B"
                tick={{ fill: "#6B6B6B", fontSize: 13 }}
                axisLine={{ stroke: "#6B6B6B" }}
                tickLine={{ stroke: "#6B6B6B" }}
                tickFormatter={(val) => `${Number(val).toLocaleString("en-US")}`}
              />
              <Tooltip content={<OrdersTooltip />} />
              <Line
                type="monotone"
                dataKey="orders"
                name="عدد الطلبات"
                stroke="#C49A6C"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#C49A6C", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6, fill: "#C49A6C" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardCard>

        {/* Monthly Sales Bar Chart */}
        <DashboardCard
          title="المبيعات الشهرية"
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
        >
          <ResponsiveContainer width="100%" height={300} style={{ direction: "ltr" }}>
            <BarChart data={displaySalesData} margin={{ top: 5, right: 5, left: 25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBD8B7" />
              <XAxis
                dataKey="month"
                stroke="#6B6B6B"
                tick={{ fill: "#6B6B6B", fontSize: 14 }}
                axisLine={{ stroke: "#6B6B6B" }}
                tickLine={{ stroke: "#6B6B6B" }}
              />
              <YAxis
                orientation="left"
                width={80}
                stroke="#6B6B6B"
                tick={{ fill: "#6B6B6B", fontSize: 13 }}
                axisLine={{ stroke: "#6B6B6B" }}
                tickLine={{ stroke: "#6B6B6B" }}
                tickFormatter={(val) => `${Number(val).toLocaleString("en-US")}`}
              />
              <Tooltip content={<SalesTooltip />} />
              <Bar
                dataKey="sales"
                name="المبيعات (ج.م)"
                fill="#005B7F"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>
    </div>
  );
}
