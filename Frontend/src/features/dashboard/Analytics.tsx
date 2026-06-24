import { DashboardCard } from "@/components/ui/DashboardCard";
import { TrendingUp, ShoppingBag } from "lucide-react";
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

const salesData = [
  { month: "يناير", sales: 4000 },
  { month: "فبراير", sales: 3500 },
  { month: "مارس", sales: 5000 },
  { month: "أبريل", sales: 4500 },
  { month: "مايو", sales: 6000 },
  { month: "يونيو", sales: 7500 },
];

const ordersData = [
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
      <p className="mt-1 m-0 text-primary">
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
      <p className="mt-1 m-0 text-accent">
        {payload[0].value?.toLocaleString("en-US")} طلب
      </p>
    </div>
  );
}

export function Analytics() {
  return (
    <div className="w-full">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Monthly Orders Line Chart */}
        <DashboardCard
          title="عدد الطلبات الشهرية"
          icon={<ShoppingBag className="w-6 h-6 text-accent" />}
        >
          <ResponsiveContainer width="100%" height={300} style={{ direction: "ltr" }}>
            <LineChart data={ordersData} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
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
                domain={[0, 60]}
                ticks={[0, 15, 30, 45, 60]}
              />
              <Tooltip content={<OrdersTooltip />} />
              <Line
                type="monotone"
                dataKey="orders"
                name="عدد الطلبات"
                stroke="#C49A6C"
                strokeWidth={3}
                dot={{ r: 3, stroke: "#C49A6C", strokeWidth: 3, fill: "#fff" }}
                activeDot={{ r: 5, fill: "#C49A6C" }}
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
            <BarChart data={salesData} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
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
              <Bar
                dataKey="sales"
                name="المبيعات (ج.م)"
                fill="#005B7F"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>
    </div>
  );
}
