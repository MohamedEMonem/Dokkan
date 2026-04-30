import { Package, Plus, Filter, SquarePen, Trash2 } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";

const PRODUCTS_MOCK = [
  {
    id: 1,
    name: "ساعة ذكية رياضية",
    price: 250,
    stock: 50,
    status: "active",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
  },
  {
    id: 2,
    name: "سماعات لاسلكية",
    price: 180,
    stock: 35,
    status: "active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
  },
  {
    id: 3,
    name: "حقيبة ظهر عصرية",
    price: 120,
    stock: 75,
    status: "inactive",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200",
  },
  {
    id: 4,
    name: "نظارة شمسية كلاسيكية",
    price: 95,
    stock: 60,
    status: "active",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200",
  },
];

export function Products() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <DashboardCard
        title={`جميع المنتجات (${PRODUCTS_MOCK.length})`}
        icon={<Package className="w-6 h-6 text-primary" />}
        headerAction={
          <div className="flex items-center gap-2">
            <Button
              variant="outline-accent"
              className="w-auto! h-9! px-4 text-sm"
              icon={<Filter className="w-4 h-4" />}
            >
              تصفية متقدمة
            </Button>
            <Button
              variant="primary"
              className="w-auto! h-9! px-4 text-sm"
              icon={<Plus className="w-4 h-4" />}
            >
              إضافة منتج
            </Button>
          </div>
        }
      >
        <div className="relative w-full overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b-2 border-accent-light/50 text-text-dark font-bold">
                <th className="pb-4 px-2 whitespace-nowrap">الصورة</th>
                <th className="pb-4 px-2 whitespace-nowrap">اسم المنتج</th>
                <th className="pb-4 px-2 whitespace-nowrap">السعر</th>
                <th className="pb-4 px-2 whitespace-nowrap">المخزون</th>
                <th className="pb-4 px-2 whitespace-nowrap">الحالة</th>
                <th className="pb-4 px-2 whitespace-nowrap text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-light/30">
              {PRODUCTS_MOCK.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-bg-cream/50 transition-colors"
                >
                  <td className="py-4 px-2">
                    <div className="w-12 h-12 bg-bg-cream rounded-lg overflow-hidden border border-accent-light shadow-sm">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-2 font-semibold text-text-dark">
                    {product.name}
                  </td>
                  <td className="py-4 px-2 text-primary font-bold">
                    {product.price} ج.م
                  </td>
                  <td className="py-4 px-2 text-text-muted">
                    {product.stock}
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold text-white shadow-sm transition-colors ${
                        product.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {product.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="tertiary"
                        className="size-9! p-0"
                        title="تعديل"
                        icon={<SquarePen className="w-4 h-4" />}
                      />
                      <Button
                        variant="tertiary"
                        className="size-9! p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="حذف"
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
