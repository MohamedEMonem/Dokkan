import { Users, Store, Flag, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";

export function AdminOverview() {
  // Mock data for system overview statistics
  const adminStats = {
    totalUsers: { value: 1240, change: "+8%" },
    activeStores: { value: 85, change: "+12%" },
    activeSubscriptions: { value: 64, change: "+5%" },
    pendingFlags: { value: 7, change: "-2" },
  };

  // Mock list of recent flagged content
  const recentFlags = [
    {
      id: "1",
      targetType: "منتج",
      targetName: "ساعة يد فاخرة (مقلدة)",
      reason: "بيع منتجات مقلدة لعلامة تجارية مسجلة",
      reporter: "أحمد علي",
      status: "قيد المراجعة",
    },
    {
      id: "2",
      targetType: "متجر",
      targetName: "متجر ملابس الأطفال الأنيقة",
      reason: "استخدام صور غير مرخصة وحقوق طبع ونشر",
      reporter: "سارة محمد",
      status: "جديد",
    },
  ];

  // Mock list of stores pending approval
  const pendingStores = [
    {
      id: "101",
      name: "دكان الإلكترونيات الحديثة",
      owner: "محمود حسن",
      date: "منذ ساعتين",
    },
    {
      id: "102",
      name: "متجر أدوات الطهي الاحترافية",
      owner: "فاطمة عمر",
      date: "منذ يوم واحد",
    },
  ];

  return (
    <div className="space-y-6 w-full font-sans select-none">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-dark">مرحباً بك في لوحة الإدارة العامة</h2>
          <p className="text-text-muted text-sm mt-1">تتبع نمو المنصة وإدارة المحتوى والطلبات المعلقة.</p>
        </div>
      </div>

      {/* Grid of Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المستخدمين"
          value={adminStats.totalUsers.value}
          icon={<Users className="w-6 h-6 text-accent" />}
          action={
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              {adminStats.totalUsers.change}
            </span>
          }
          className="bg-white border-2 border-accent-light shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="المتاجر النشطة"
          value={adminStats.activeStores.value}
          icon={<Store className="w-6 h-6 text-accent-dark" />}
          action={
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              {adminStats.activeStores.change}
            </span>
          }
          className="bg-white border-2 border-accent-light shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="الاشتراكات الفعالة"
          value={adminStats.activeSubscriptions.value}
          icon={<CreditCard className="w-6 h-6 text-primary" />}
          action={
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              {adminStats.activeSubscriptions.change}
            </span>
          }
          className="bg-white border-2 border-accent-light shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="إبلاغات معلقة"
          value={adminStats.pendingFlags.value}
          icon={<Flag className="w-6 h-6 text-red-500" />}
          action={
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              {adminStats.pendingFlags.change} معلق
            </span>
          }
          className="bg-white border-2 border-accent-light shadow-md hover:shadow-lg transition-shadow"
        />
      </div>

      {/* Main Double Dashboard Layout Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flagged Content / Moderation Card */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard
            title="طلبات الإبلاغ الأخيرة"
            icon={<Flag className="w-5 h-5 text-red-500 animate-pulse" />}
            headerAction={
              <Button variant="tertiary" className="text-xs font-bold px-3 py-1 hover:bg-gray-100">
                عرض كل الإبلاغات
              </Button>
            }
          >
            <div className="divide-y divide-gray-100">
              {recentFlags.map((flag) => (
                <div key={flag.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-md">
                        إبلاغ {flag.targetType}
                      </span>
                      <h4 className="text-sm font-bold text-text-dark">{flag.targetName}</h4>
                    </div>
                    <p className="text-xs text-text-muted">السبب: {flag.reason}</p>
                    <p className="text-[10px] text-text-muted">المبلغ: {flag.reporter}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                      {flag.status}
                    </span>
                    <Button variant="outline-accent" className="px-3 py-1 text-xs h-7! w-auto!">
                      إجراء
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Pending Stores Approval Card */}
        <div className="lg:col-span-1">
          <DashboardCard
            title="متاجر معلقة للمراجعة"
            icon={<AlertTriangle className="w-5 h-5 text-accent" />}
          >
            <div className="space-y-4">
              {pendingStores.map((store) => (
                <div
                  key={store.id}
                  className="p-3 bg-bg-cream rounded-xl border border-accent-light/50 flex items-center justify-between gap-3 hover:border-accent transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-text-dark truncate">{store.name}</h4>
                    <p className="text-[10px] text-text-muted truncate mt-0.5">البائع: {store.owner}</p>
                    <p className="text-[9px] text-text-muted font-mono mt-1">{store.date}</p>
                  </div>
                  <Button variant="primary" className="px-3 py-1.5 text-[10px] h-7! w-auto! shrink-0">
                    مراجعة
                  </Button>
                </div>
              ))}
              
              {pendingStores.length === 0 && (
                <div className="text-center p-6 text-text-muted">
                  لا توجد طلبات معلقة
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
export default AdminOverview;
