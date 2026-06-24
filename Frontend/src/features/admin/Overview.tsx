import { Users, Store, Package, MessageSquare, AlertTriangle, Star, ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/ui/StatCard";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";
import { useGetProductsQuery } from "@/api/product.api";


// Stats overview data for platform health
const adminStats = {
  totalUsers: { value: 1240, change: "+8%" },
  activeStores: { value: 85, change: "+12%" },
  totalProducts: { value: 3450, change: "+24%" },
  totalReviews: { value: 920, change: "+15%" },
};

// Mock list of recent platform reviews/comments
const recentReviews = [
  {
    id: "r1",
    productId: "p1",
    storeSubdomain: "digital-corner",
    userName: "محمد أحمد",
    productName: "سماعات بلوتوث الرياضية",
    storeName: "ركن الرقميات",
    comment: "سماعات ممتازة، جودة الصوت رائعة وعازل الضوضاء يعمل بشكل جيد جداً.",
    rating: 5,
  },
  {
    id: "r2",
    productId: "p2",
    storeSubdomain: "elegant-fashion",
    userName: "منى محمود",
    productName: "فستان قطني صيفي",
    storeName: "متجر أنيق للموضة",
    comment: "الخامة جيدة ولكن المقاس كان أصغر قليلاً من المتوقع.",
    rating: 3,
  },
  {
    id: "r3",
    productId: "p3",
    storeSubdomain: "modern-kitchen",
    userName: "كريم يوسف",
    productName: "ماكينة إعداد القهوة",
    storeName: "بيت المطبخ الحديث",
    comment: "تأخر التوصيل لثلاثة أيام والتغليف كان متضرراً.",
    rating: 2,
  },
];

// Mock list of recently added products
const recentProducts = [
  {
    id: "p1",
    title: "هاتف ذكي X100 Pro",
    storeName: "ركن الرقميات",
    storeSubdomain: "digital-corner",
    price: "١٥,٠٠٠ ج.م",
    category: "إلكترونيات",
  },
  {
    id: "p2",
    title: "حذاء ركض رياضي خفيف",
    storeName: "الرياضي المحترف",
    storeSubdomain: "pro-athlete",
    price: "١,٢٠٠ ج.م",
    category: "ملابس رياضية",
  },
  {
    id: "p3",
    title: "ساعة حائط كلاسيكية خشبية",
    storeName: "بيت الديكور",
    storeSubdomain: "decor-house",
    price: "٤٥٠ ج.م",
    category: "ديكور منزل",
  },
];

// Mock list of stores pending approval
const pendingStores = [
  {
    id: "101",
    name: "دكان الإلكترونيات الحديثة",
    subdomain: "modern-electronics",
    owner: "محمود حسن",
    date: "منذ ساعتين",
  },
  {
    id: "102",
    name: "متجر أدوات الطهي الاحترافية",
    subdomain: "pro-cooking",
    owner: "فاطمة عمر",
    date: "منذ يوم واحد",
  },
];

export function AdminOverview() {
  const { data: response, isLoading: productsLoading } = useGetProductsQuery({ page: 1, limit: 5 });
  const recentProductsList = response?.data?.products || [];
  const totalProductsCount = response?.data?.meta?.total || 0;

  return (
    <div className="space-y-6 w-full font-sans select-none">
      {/* Top Welcome Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-text-dark">مرحباً بك في لوحة الإدارة العامة</h2>
        <p className="text-text-muted text-sm mt-1">تتبع نمو المنصة ومتابعة المتاجر، المنتجات، والتعليقات النشطة.</p>
      </div>

      {/* Grid of Platform Stats (Users, Stores, Products, and Reviews) */}
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
          variant="default"
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
          variant="default"
        />
        <StatCard
          title="إجمالي المنتجات"
          value={productsLoading ? "..." : totalProductsCount}
          icon={<Package className="w-6 h-6 text-primary" />}
          action={
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              {adminStats.totalProducts.change}
            </span>
          }
          variant="default"
        />
        <StatCard
          title="إجمالي التعليقات والتقييمات"
          value={adminStats.totalReviews.value}
          icon={<MessageSquare className="w-6 h-6 text-primary-light" />}
          action={
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              {adminStats.totalReviews.change}
            </span>
          }
          variant="default"
        />
      </div>

      {/* Two Column Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Products & Recent Reviews (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Products overview */}
          <DashboardCard
            title="آخر المنتجات المضافة حديثاً"
            icon={<Package className="w-5 h-5 text-primary" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-accent-light text-text-muted bg-bg-cream/40">
                    <th className="py-2.5 px-3">اسم المنتج</th>
                    <th className="py-2.5 px-3">المتجر</th>
                    <th className="py-2.5 px-3">التصنيف</th>
                    <th className="py-2.5 px-3">السعر</th>
                    <th className="py-2.5 px-3 text-center">الرصد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productsLoading ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-text-muted">
                        جاري تحميل المنتجات...
                      </td>
                    </tr>
                  ) : recentProductsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-text-muted">
                        لا توجد منتجات مسجلة بالمنصة
                      </td>
                    </tr>
                  ) : (
                    recentProductsList.map((product) => (
                      <tr key={product.id} className="hover:bg-bg-cream/20 transition-colors">
                        <td className="py-3 px-3 font-semibold text-text-dark">
                          <Link to={`/products/${product.id}`} className="hover:text-primary transition-colors block w-full">
                            {product.title}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-text-muted">
                          {product.store ? (
                            <Link to={`/${product.store.subdomain}`} className="hover:text-primary transition-colors block w-full">
                              {product.store.name}
                            </Link>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3 px-3 text-text-muted">
                          <span className="bg-accent-light/30 text-accent-dark px-2 py-0.5 rounded-md text-[10px]">
                            منتج
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-primary">
                          {Number(product.price).toLocaleString("ar-EG")} ج.م
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Button variant="tertiary" className="text-red-500 hover:bg-red-50 px-2.5 py-1 text-[10px] h-6! w-auto! inline-flex items-center gap-1">
                            حظر المنتج
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </DashboardCard>

          {/* Recent Reviews/Comments */}
          <DashboardCard
            title="أحدث التقييمات والتعليقات بالمنصة"
            icon={<MessageSquare className="w-5 h-5 text-accent" />}
          >
            <div className="divide-y divide-gray-100">
              {recentReviews.map((review) => (
                <div key={review.id} className="py-4.5 first:pt-0 last:pb-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-dark text-xs">{review.userName}</span>
                      <span className="text-[10px] text-text-muted">
                        على{" "}
                        <Link to={`/products/${review.productId}`} className="hover:text-primary transition-colors font-semibold">
                          {review.productName}
                        </Link>{" "}
                        (
                        <Link to={`/${review.storeSubdomain}`} className="hover:text-primary transition-colors">
                          {review.storeName}
                        </Link>
                        )
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-text-muted bg-bg-cream/30 p-3 rounded-xl border border-accent-light/40">
                    "{review.comment}"
                  </p>

                  <div className="flex justify-end gap-2">
                    <Button variant="tertiary" className="text-red-500 hover:bg-red-50 px-2 py-1 text-[10px] h-6! w-auto!">
                      حذف التعليق
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Right Column: Stores Pending Approval & Analytics (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pending Stores Approval */}
          <DashboardCard
            title="متاجر معلقة للمراجعة والتفعيل"
            icon={<AlertTriangle className="w-5 h-5 text-accent" />}
          >
            <div className="space-y-4">
              {pendingStores.map((store) => (
                <div
                  key={store.id}
                  className="p-4 bg-bg-cream rounded-xl border border-accent-light/50 flex items-center justify-between gap-3 hover:border-accent hover:shadow-xs transition-all duration-200"
                >
                  {/* Clickable text card wrapper */}
                  <Link to={`/${store.subdomain}`} className="min-w-0 flex-1 hover:text-primary transition-colors block text-right">
                    <h4 className="text-xs font-bold text-text-dark truncate">{store.name}</h4>
                    <p className="text-[10px] text-text-muted truncate mt-0.5">البائع: {store.owner}</p>
                    <p className="text-[9px] text-text-muted font-mono mt-1">{store.date}</p>
                  </Link>
                  <Button variant="primary" className="px-3.5 py-1.5 text-[10px] h-7.5! w-auto! shrink-0">
                    تفعيل المتجر
                  </Button>
                </div>
              ))}
              
              {pendingStores.length === 0 && (
                <div className="text-center p-6 text-text-muted text-xs">
                  لا توجد متاجر معلقة للمراجعة.
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Quick Platform Management Guides */}
          <DashboardCard
            title="إرشادات الإدارة السريعة"
            icon={<ArrowLeftRight className="w-5 h-5 text-primary" />}
          >
            <div className="text-xs text-text-muted space-y-3 leading-relaxed">
              <p>📌 <strong>مراجعة المنتجات:</strong> يمكنك مراقبة المنتجات وحظر أي منتج مخالف لقوانين البيع فوراً بالضغط على حظر المنتج.</p>
              <p>📌 <strong>مراقبة التقييمات:</strong> في حال رصد تعليق مسيء أو غير لائق، يمكنك حذفه للحفاظ على سلامة محتوى المنصة.</p>
              <p>📌 <strong>تفعيل المتاجر المعلقة:</strong> قم بمراجعة بيانات المتاجر الجديدة قبل تفعيلها لتتمكن من البيع.</p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
export default AdminOverview;
