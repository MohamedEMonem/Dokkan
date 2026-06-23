import React, { useMemo, useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Star, SlidersHorizontal } from "lucide-react";
import ErrorPage from "@/pages/ErrorPage";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useListStoresQuery } from "@/api/store.api";
import { useGetProductsByStoreIdQuery } from "@/api/product.api";
import FilterAsideBar from "@/components/ui/FilterAsideBar";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";

const StoreProducts: React.FC = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcat = searchParams.get("subcat");

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter state structure matching FilterAsideBar expectations
  const [filters, setFilters] = useState({
    search: "",
    category: activeSubcat || "all",
    city: "all",
    rating: "all",
    shipping: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [prevFilters, setPrevFilters] = useState(filters);
  if (filters !== prevFilters) {
    setPrevFilters(filters);
    setCurrentPage(1);
  }

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
  const { data: productsResponse, isLoading: isProductsLoading, isError: isProductsError } = useGetProductsByStoreIdQuery(
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

  // Sync category filter state if URL subcat param changes externally
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: activeSubcat || "all",
    }));
  }, [activeSubcat]);

  // Sync URL search param if category changes inside FilterAsideBar
  useEffect(() => {
    if (filters.category === "all") {
      searchParams.delete("subcat");
    } else {
      searchParams.set("subcat", filters.category);
    }
    setSearchParams(searchParams);
  }, [filters.category]);

  // Filter products based on search terms and selected subcategory
  const filteredProducts = useMemo(() => {
    let list = productsList;

    if (filters.category !== "all") {
      list = list.filter((p) => p.subCategoryId === filters.category);
    }

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    if (filters.rating !== "all") {
      const minRating = parseFloat(filters.rating);
      list = list.filter((p) => (p.averageRating ?? 4.8) >= minRating);
    }

    return list;
  }, [productsList, filters.category, filters.search, filters.rating]);

  const reset = () => {
    setFilters({
      search: "",
      category: "all",
      city: "all",
      rating: "all",
      shipping: false,
    });
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const fromIndex = paginatedProducts.length
    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
    : 0;
  const toIndex = (currentPage - 1) * ITEMS_PER_PAGE + paginatedProducts.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        {/* Count and Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <p className="text-gray-600 text-sm">
            عرض {fromIndex}–{toIndex} من أصل {filteredProducts.length} منتج
          </p>
          <div className="flex items-center lg:hidden">
            <Button
              variant="outline-accent"
              onClick={() => setIsMobileFilterOpen(true)}
              className="h-9! items-center gap-2 px-4 py-2.5 border! text-gray-700!"
              icon={<SlidersHorizontal size={18} className="text-gray-500" />}
              iconPos="right"
            >
              <span className="text-sm font-medium">الفلاتر</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Reusable FilterAsideBar (handles desktop sidebar & mobile slide-out) */}
          <FilterAsideBar
            filters={filters}
            setFilters={setFilters}
            categories={subcategories}
            showCity={false}
            showShipping={false}
            showRating={true}
            showSearch={true}
            showCategory={true}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1 w-full">
            {isProductsLoading ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                <p className="text-gray-600">جاري تحميل المنتجات...</p>
              </div>
            ) : isProductsError ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                <p className="text-red-600">حدث خطأ أثناء تحميل المنتجات.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm flex flex-col items-center">
                <p className="text-gray-600 mb-4">
                  لم يتم العثور على منتجات تطابق معاييرك.
                </p>
                <Button
                  variant="outline-accent"
                  onClick={() => reset()}
                  data-slot="button"
                  className="w-fit! h-9! lg:h-12! px-4 py-2 lg:px-6 rounded-lg text-black! border! outline-none! text-sm! lg:text-base! hover:text-white!"
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProducts;
