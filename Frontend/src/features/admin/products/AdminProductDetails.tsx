import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery, useUpdateProductMutation, useDeleteProductMutation } from "@/api/product.api";
import { IProduct } from "@/types/entities/product.types";
import { Button } from "@/components/ui/Button";
import { showNotification } from "@/utils/showNotification";
import { ArrowRight, Package, Store, Eye, Trash2, CheckCircle, AlertTriangle, Info } from "lucide-react";

// Extended product type that includes nested relations returned by the backend
type IProductWithRelations = IProduct & {
  subCategory?: {
    name: string;
    category?: { name: string };
  };
};

export function AdminProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useGetProductByIdQuery(
    { id: id ?? "" },
    { skip: !id }
  );

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const product = response?.data as IProductWithRelations | undefined;

  const handleToggleStatus = async () => {
    if (!product) return;
    const nextStatus = product.status === "Active" ? "Inactive" : "Active";
    try {
      await updateProduct({
        id: product.id,
        data: { status: nextStatus } as any,
      }).unwrap();
      showNotification({
        message: `تم تغيير حالة المنتج بنجاح إلى ${nextStatus === "Active" ? "نشط" : "غير نشط"}`,
        variant: "success",
      });
    } catch (err: any) {
      showNotification({
        message: err?.data?.message || "حدث خطأ أثناء تعديل حالة المنتج",
        variant: "error",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف المنتج: "${product.title}" نهائياً من المنصة؟`)) {
      return;
    }
    try {
      await deleteProduct({ id: product.id }).unwrap();
      showNotification({
        message: "تم حذف المنتج بنجاح من المنصة",
        variant: "success",
      });
      navigate("/admin/products");
    } catch (err: any) {
      showNotification({
        message: err?.data?.message || "حدث خطأ أثناء محاولة حذف المنتج",
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border-2 border-accent-light shadow-sm min-h-[300px] font-sans rtl">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-text-muted text-sm font-medium mt-3">جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-8 bg-white rounded-xl border-2 border-accent-light shadow-sm text-center font-sans rtl">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-text-dark mb-1">تعذر تحميل تفاصيل المنتج</h3>
        <p className="text-text-muted text-sm mb-4">ربما تم حذف هذا المنتج أو أن الرابط غير صحيح.</p>
        <Button onClick={() => navigate("/admin/products")} variant="primary">
          <ArrowRight className="w-4 h-4 ml-2" /> العودة لإدارة المنتجات
        </Button>
      </div>
    );
  }

  const primaryImage = product.images?.[0]?.imageUrl;
  const stock = product.stockQuantity;
  const isActive = product.status === "Active";

  // Stock Badge Color Rules
  let stockBadgeColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
  let stockText = `${stock} وحدة متوفرة`;
  if (stock === 0) {
    stockBadgeColor = "text-red-600 bg-red-50 border-red-100";
    stockText = "نفذ المخزون";
  } else if (stock < 5) {
    stockBadgeColor = "text-amber-600 bg-amber-50 border-amber-100";
    stockText = `متبقي ${stock} وحدات فقط`;
  }

  return (
    <div className="space-y-6 w-full font-sans select-none" dir="rtl">
      {/* Top Navigation / Breadcrumbs & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <Link to="/admin" className="hover:text-primary transition-colors">لوحة التحكم</Link>
            <span>/</span>
            <Link to="/admin/products" className="hover:text-primary transition-colors">إدارة المنتجات</Link>
            <span>/</span>
            <span className="text-text-dark font-medium">عرض تفاصيل المنتج</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-text-dark">{product.title}</h2>
        </div>
        <Button onClick={() => navigate("/admin/products")} variant="outline-accent" className="h-9! text-xs font-semibold">
          <ArrowRight className="w-4 h-4 ml-2" /> العودة للقائمة
        </Button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right Column (2/3 Width): Core Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border-2 border-accent-light p-6 shadow-sm space-y-6">
            {/* Title & Description Section */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-text-dark flex items-center gap-2 border-b-2 border-accent-light pb-2">
                <Info className="w-4 h-4 text-primary" /> تفاصيل المنتج
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs text-text-muted block">السعر المعروض:</span>
                  <span className="text-lg font-bold text-primary">{Number(product.price).toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">مخزون المنتج:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border inline-block mt-1 ${stockBadgeColor}`}>
                    {stockText}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Description */}
            <div className="space-y-2">
              <span className="text-xs text-text-muted block">الوصف والتفاصيل:</span>
              <p className="text-xs md:text-sm text-text-dark leading-relaxed bg-bg-cream/25 p-4 rounded-xl border border-accent-light">
                {product.description || "لا يوجد وصف أو تفاصيل مضافة لهذا المنتج حالياً."}
              </p>
            </div>

            {/* SubCategory and Category */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-text-muted">التصنيف والتبويب:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">
                  منتج عام بالمنصة
                </span>
                {product.subCategory?.category?.name && (
                  <span className="bg-accent-light/40 text-accent-dark px-3 py-1 rounded-lg text-xs font-bold">
                    التصنيف الرئيسي: {product.subCategory.category.name}
                  </span>
                )}
                {product.subCategory?.name && (
                  <span className="bg-accent-light/40 text-accent-dark px-3 py-1 rounded-lg text-xs font-bold">
                    التصنيف الفرعي: {product.subCategory.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Left Column (1/3 Width): Image & Moderation Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Image Gallery Card */}
          <div className="bg-white rounded-xl border-2 border-accent-light p-4 shadow-sm text-center">
            <h3 className="text-xs font-bold text-text-muted text-right mb-3">صورة المنتج التعريفية</h3>
            <div className="aspect-square bg-bg-cream/40 rounded-xl overflow-hidden border border-accent-light flex items-center justify-center">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-accent">
                  <Package className="w-12 h-12" />
                  <span className="text-xs font-semibold text-text-muted">لا توجد صورة للمنتج</span>
                </div>
              )}
            </div>
          </div>

          {/* Platform Moderation Actions Card */}
          <div className="bg-white rounded-xl border-2 border-accent-light p-5 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-text-dark border-b border-accent-light pb-2">خيارات إدارة المنصة</h3>
            
            {/* Current Status Badge */}
            <div className="flex items-center justify-between bg-bg-cream/40 p-3 rounded-xl border border-accent-light">
              <span className="text-xs text-text-muted font-medium">حالة المنتج الحالية:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isActive ? "text-emerald-700 bg-emerald-100" : "text-gray-600 bg-gray-100"
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> نشط بالمنصة
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> غير نشط (موقوف)
                  </>
                )}
              </span>
            </div>

            {/* Store Information Mini Card */}
            {product.store && (
              <div className="p-4 bg-bg-cream/30 rounded-xl border border-accent-light space-y-2">
                <span className="text-xs text-text-muted block">المتجر التابع له:</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-dark flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-accent" /> {product.store.name}
                  </span>
                  <Link
                    to={`/@${product.store.subdomain}`}
                    className="text-[10px] font-bold text-primary hover:underline"
                    target="_blank"
                  >
                    زيارة المتجر ↗
                  </Link>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              {/* Toggle Active status */}
              <Button
                onClick={handleToggleStatus}
                disabled={isUpdating}
                variant={isActive ? "outline-accent" : "primary"}
                className={`w-full text-xs h-9.5! font-bold flex items-center justify-center gap-2 ${
                  isActive ? "text-amber-600! border-amber-200! hover:bg-amber-50!" : ""
                }`}
              >
                {isActive ? (
                  <>
                    <AlertTriangle className="w-4 h-4" /> إيقاف نشر المنتج
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> تنشيط نشر المنتج
                  </>
                )}
              </Button>

              {/* View Public product page */}
              <Link to={`/@${product.store.subdomain}/products/${product.id}`} className="w-full" target="_blank">
                <Button variant="outline-accent" className="w-full text-xs h-9.5! font-bold flex items-center justify-center gap-2 text-text-dark! hover:bg-bg-cream!">
                  <Eye className="w-4 h-4" /> معاينة صفحة العميل ↗
                </Button>
              </Link>

              {/* Delete product */}
              <Button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                variant="tertiary"
                className="w-full text-xs h-9.5! font-bold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> حذف المنتج نهائياً
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
