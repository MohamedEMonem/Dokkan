import React, { useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Star, SlidersHorizontal } from "lucide-react";
import ErrorPage from "@/pages/ErrorPage";
import { ProductCard } from "@/features/products/components/ProductCard";
import { IProduct } from "@/types/entities/product.types";
import { useListStoresQuery } from "@/api/store.api";
import { useGetProductsByStoreIdQuery } from "@/api/product.api";

interface StoreSidebarProps {
  subcategories: { id: string; name: string }[];
  activeSubcat: string | null;
  onSubcatClick: (id: string | null) => void;
}

const StoreSidebar: React.FC<StoreSidebarProps> = ({
  subcategories,
  activeSubcat,
  onSubcatClick,
}) => {
  return (
    <aside className="hidden lg:block w-64 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 shrink-0 text-right">
      <h3 className="text-base font-bold text-text-dark mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-primary" />
        <span>الأقسام الفرعية</span>
      </h3>
      <ul className="flex flex-col gap-1.5">
        <li>
          <button
            onClick={() => onSubcatClick(null)}
            className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              !activeSubcat
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-text-muted hover:bg-gray-50 hover:text-text-dark"
            }`}
          >
            جميع المنتجات
          </button>
        </li>
        {subcategories.map((sub) => (
          <li key={sub.id}>
            <button
              onClick={() => onSubcatClick(sub.id)}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSubcat === sub.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text-muted hover:bg-gray-50 hover:text-text-dark"
              }`}
            >
              {sub.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const StoreProducts: React.FC = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcat = searchParams.get("subcat");

  // If the parameter doesn't exist or doesn't start with '@', treat it as a 404 page
  if (!subdomain || !subdomain.startsWith("@")) {
    return <ErrorPage />;
  }

  const cleanSubdomain = subdomain.slice(1);

  // 1. Fetch store info by subdomain slug
  const { data: storeResponse, isLoading: isStoreLoading, isError: isStoreError } = useListStoresQuery({
    subdomain: cleanSubdomain,
  });

  const store = storeResponse?.data?.stores?.[0];

  // 2. Fetch products for this store (skip if store not loaded yet)
  const { data: productsResponse, isLoading: isProductsLoading } = useGetProductsByStoreIdQuery(
    store?.id || "",
    { skip: !store?.id }
  );

  const productsList = productsResponse?.data?.products || [];

  // Extract unique subcategories from live products list
  const subcategories = useMemo(() => {
    const map = new Map<string, string>();
    productsList.forEach((p) => {
      const subCat = (p as any).subCategory;
      if (subCat) {
        map.set(subCat.id, subCat.name);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [productsList]);

  // Filter products based on search parameter
  const filteredProducts = useMemo(() => {
    if (!activeSubcat) return productsList;

    return productsList.filter((p) => p.subCategoryId === activeSubcat);
  }, [productsList, activeSubcat]);

  const handleSubcatClick = (id: string | null) => {
    if (id) {
      setSearchParams({ subcat: id });
    } else {
      searchParams.delete("subcat");
      setSearchParams(searchParams);
    }
  };

  if (isStoreLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center" dir="rtl">
        <p className="text-gray-600 text-lg">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  if (isStoreError || !store) {
    return <ErrorPage />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16" dir="rtl">
      {/* Mini Banner Header */}
      <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-right">
            <Link
              to={`/${subdomain}`}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="العودة للمتجر"
            >
              <ArrowRight size={20} className="text-text-dark" />
            </Link>
            <div className="size-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-white shrink-0">
              <img
                src={
                  store.logoUrl ||
                  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                }
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-dark flex items-center gap-2">
                <span>{store.name}</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                  المنتجات
                </span>
              </h1>
              <p className="text-xs text-text-muted mt-0.5 max-w-md line-clamp-1">
                {store.description || "أهلاً بكم في متجرنا الإلكتروني!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shrink-0">
            <span className="text-text-dark font-bold">{store.averageRating || "4.8"}</span>
            <Star size={14} className="text-accent fill-currentColor" />
            <span className="text-text-muted">({store.reviewCount || "0"} تقييم)</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Subcategories Sidebar - Desktop */}
          <StoreSidebar
            subcategories={subcategories}
            activeSubcat={activeSubcat}
            onSubcatClick={handleSubcatClick}
          />

          {/* Subcategories Filter - Mobile horizontal scroll */}
          <div className="lg:hidden w-full overflow-x-auto pb-4 scrollbar-none flex gap-2 snap-x snap-mandatory">
            <button
              onClick={() => handleSubcatClick(null)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap snap-start border transition-all ${
                !activeSubcat
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-text-muted border-gray-200"
              }`}
            >
              جميع المنتجات
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubcatClick(sub.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap snap-start border transition-all ${
                  activeSubcat === sub.id
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-text-muted border-gray-200"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="flex-1 w-full">
            {isProductsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">جاري تحميل المنتجات...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                <p className="text-text-muted text-base mb-4">
                  لا توجد منتجات متوفرة في هذا القسم حالياً.
                </p>
                <button
                  onClick={() => handleSubcatClick(null)}
                  className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  عرض جميع المنتجات
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProducts;
