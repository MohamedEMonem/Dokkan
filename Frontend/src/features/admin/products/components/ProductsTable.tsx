import { Link } from "react-router-dom";
import { Package, Trash2, Eye } from "lucide-react";
import { IProduct } from "@/types/entities/product.types";
import { Button } from "@/components/ui/Button";

interface ProductsTableProps {
  products: IProduct[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, isLoading, onDelete }: ProductsTableProps) {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف المنتج: "${name}"؟`)) {
      onDelete(id);
    }
  };

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm font-sans select-none">
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-muted text-sm font-medium">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm text-center p-12 font-sans select-none">
        <Package className="w-16 h-16 mx-auto mb-4 text-accent-light" />
        <h3 className="text-base font-bold text-text-dark mb-1">لا توجد منتجات مطابقة للبحث</h3>
        <p className="text-text-muted text-xs">حاول تغيير خيارات التصفية أو البحث عن كلمة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm font-sans select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b-2 border-accent-light text-text-muted bg-bg-cream/40 font-bold">
              <th className="py-3.5 px-4">تفاصيل المنتج</th>
              <th className="py-3.5 px-4">المتجر</th>
              <th className="py-3.5 px-4">السعر</th>
              <th className="py-3.5 px-4">المخزون</th>
              <th className="py-3.5 px-4">الحالة</th>
              <th className="py-3.5 px-4 text-center">التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const primaryImage = product.images?.[0]?.imageUrl;
              const stock = product.stockQuantity;

              // Stock badge style rules
              let stockBadgeColor = "text-emerald-600 bg-emerald-50 border border-emerald-100";
              let stockText = `${stock} وحدة`;
              if (stock === 0) {
                stockBadgeColor = "text-red-600 bg-red-50 border border-red-100";
                stockText = "نفذ المخزون";
              } else if (stock < 5) {
                stockBadgeColor = "text-amber-600 bg-amber-50 border border-amber-100";
                stockText = `متبقي ${stock} فقط`;
              }

              // Status style rules
              const isActive = product.status === "Active";

              return (
                <tr key={product.id} className="hover:bg-bg-cream/10 transition-colors">
                  {/* Title & Image column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-accent-light/60 bg-gray-50"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-bg-cream border border-accent-light/60 flex items-center justify-center text-accent">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          to={`/products/${product.id}`}
                          className="font-bold text-text-dark hover:text-primary transition-colors block truncate max-w-[200px]"
                        >
                          {product.title}
                        </Link>
                      </div>
                    </div>
                  </td>

                  {/* Store Name column */}
                  <td className="py-4 px-4 text-text-muted font-medium">
                    {product.store ? (
                      <Link
                        to={`/${product.store.subdomain}`}
                        className="hover:text-primary transition-colors"
                      >
                        {product.store.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Price column */}
                  <td className="py-4 px-4 font-bold text-primary">
                    {Number(product.price).toLocaleString("ar-EG")} ج.م
                  </td>

                  {/* Stock Quantity column */}
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${stockBadgeColor}`}>
                      {stockText}
                    </span>
                  </td>

                  {/* Status column */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "text-emerald-700 bg-emerald-100/50"
                          : "text-gray-500 bg-gray-100"
                      }`}
                    >
                      {isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>

                  {/* Actions column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-bg-cream rounded-md transition-colors"
                        title="عرض تفاصيل المنتج"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-colors cursor-pointer border border-transparent hover:border-red-600"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
