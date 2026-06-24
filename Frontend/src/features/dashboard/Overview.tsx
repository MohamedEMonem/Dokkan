import { DashboardCard } from "@/components/ui/DashboardCard";
import { TrendingUp, ShoppingBag, Package, ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";

const salesData = [
  { month: "يناير", sales: 4000 },
  { month: "فبراير", sales: 3500 },
  { month: "مارس", sales: 5000 },
  { month: "أبريل", sales: 4500 },
  { month: "مايو", sales: 6000 },
  { month: "يونيو", sales: 7500 },
];

function SalesTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #EBD8B7",
        borderRadius: 12,
        padding: "10px 14px",
        direction: "rtl",
        fontFamily: "inherit",
      }}
    >
      <p style={{ margin: 0, fontWeight: 600, color: "#2B2B2B" }}>{label}</p>
      <p style={{ margin: "4px 0 0", color: "#005B7F" }}>
        {payload[0].value?.toLocaleString("ar-EG")} ج.م
      </p>
    </div>
  );
}

export function Overview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 w-full">
      {/* Sales Growth Card */}
      <DashboardCard
        title="نمو المبيعات - آخر 6 أشهر"
        icon={<TrendingUp className="w-6 h-6 text-primary" />}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EBD8B7" />
            <XAxis
              dataKey="month"
              stroke="#6B6B6B"
              tick={{ fill: "#6B6B6B", fontSize: 13 }}
              axisLine={{ stroke: "#6B6B6B" }}
              tickLine={{ stroke: "#6B6B6B" }}
            />
            <YAxis
              orientation="left"
              width={60}
              stroke="#6B6B6B"
              tick={{ fill: "#6B6B6B", fontSize: 13 }}
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
          <div className="p-8 text-center text-text-muted">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-accent-light" />
            <p>لا توجد طلبات حتى الآن</p>
          </div>
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
          <div className="p-8 text-center text-text-muted flex flex-col items-center justify-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-accent-light" />
            <p className="mb-4">لا توجد منتجات حتى الآن</p>
            <Button
              variant="primary"
              className="w-auto! px-4 py-2 text-sm"
              icon={<Plus className="w-4 h-4 ml-2" />}
            >
              إضافة أول منتج
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
