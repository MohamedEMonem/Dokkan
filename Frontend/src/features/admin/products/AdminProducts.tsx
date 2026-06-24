import { useState, useEffect } from "react";
import { useGetProductsQuery, useDeleteProductMutation } from "@/api/product.api";
import { IProduct } from "@/types/entities/product.types";
import { ProductsFilter, ProductsFilterState } from "./components/ProductsFilter";
import { ProductsTable } from "./components/ProductsTable";
import { Pagination } from "@/components/ui/Pagination";
import { showNotification } from "@/utils/showNotification";
import { Package, CheckCircle, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

// Fallback dummy products in case the database is empty
const dummyProducts: IProduct[] = [
  {
    id: "p1",
    storeId: "s1",
    title: "هاتف ذكي X100 Pro",
    price: 15000,
    stockQuantity: 12,
    status: "Active" as any,
    images: [{ id: "img1", imageUrl: "" } as any],
    store: { id: "s1", name: "ركن الرقميات", subdomain: "digital-corner" },
    categoryId: "c1",
    subCategoryId: "sc1",
  },
  {
    id: "p2",
    storeId: "s2",
    title: "حذاء ركض رياضي خفيف",
    price: 1200,
    stockQuantity: 3,
    status: "Active" as any,
    images: [{ id: "img2", imageUrl: "" } as any],
    store: { id: "s2", name: "الرياضي المحترف", subdomain: "pro-athlete" },
    categoryId: "c2",
    subCategoryId: "sc2",
  },
  {
    id: "p3",
    storeId: "s3",
    title: "ساعة حائط كلاسيكية خشبية",
    price: 450,
    stockQuantity: 0,
    status: "Inactive" as any,
    images: [{ id: "img3", imageUrl: "" } as any],
    store: { id: "s3", name: "بيت الديكور", subdomain: "decor-house" },
    categoryId: "c3",
    subCategoryId: "sc3",
  },
];

export function AdminProducts() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filter States
  const [filters, setFilters] = useState<ProductsFilterState>({
    search: "",
    storeId: "",
    status: "",
    sortBy: "newest",
  });

  // Debounced search state to prevent server hammering on keystrokes
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1); // Reset to first page on search change
    }, 400);

    return () => clearTimeout(handler);
  }, [filters.search]);

  // Handle filter changes
  const handleFilterChange = (updatedFilters: Partial<ProductsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
    setPage(1); // Reset page on filter change
  };

  // Map UI sorting selection to API request parameters
  let apiSortBy: "createdAt" | "title" | "price" = "createdAt";
  let apiSortDir: "asc" | "desc" = "desc";

  if (filters.sortBy === "price_asc") {
    apiSortBy = "price";
    apiSortDir = "asc";
  } else if (filters.sortBy === "price_desc") {
    apiSortBy = "price";
    apiSortDir = "desc";
  }

  // Fetch live products from API
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetProductsQuery({
    page,
    limit,
    storeId: filters.storeId || undefined,
    status: filters.status || undefined,
    sortBy: apiSortBy,
    sortDir: apiSortDir,
  } as any);

  // Fetch global count of active products
  const { data: activeProductsResponse } = useGetProductsQuery({
    limit: 1,
    status: "Active",
  } as any);

  // Fetch global count of all products (using limit 100 to compute low stock count globally)
  const { data: allProductsResponse, isLoading: isAllProductsLoading } = useGetProductsQuery({
    limit: 100,
  } as any);

  const apiProducts = response?.data?.products || [];
  
  // Since the backend doesn't have a database search parameter for listing,
  // we filter the products list client-side if a search term is active.
  const rawProducts = apiProducts.length > 0 ? apiProducts : dummyProducts;
  const products = debouncedSearch
    ? rawProducts.filter((product) =>
        product.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (product.store?.name && product.store.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
      )
    : rawProducts;

  const meta = response?.data?.meta;
  const totalPages = apiProducts.length > 0 ? (meta?.totalPages || 0) : 1;

  // Resolve global platform counts (from live API or falling back to dummy data)
  const apiTotalCount = allProductsResponse?.data?.meta?.total;
  const apiActiveCount = activeProductsResponse?.data?.meta?.total;
  const apiAllProducts = allProductsResponse?.data?.products || [];

  const globalTotalProducts = apiTotalCount !== undefined
    ? apiTotalCount
    : dummyProducts.length;

  const globalActiveProducts = apiActiveCount !== undefined
    ? apiActiveCount
    : dummyProducts.filter((p) => p.status === "Active").length;

  // Calculate global low stock count based on all fetched products (up to 100)
  const globalLowStockCount = allProductsResponse
    ? apiAllProducts.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 5).length
    : dummyProducts.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 5).length;

  // Delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct({ id }).unwrap();
      showNotification({
        message: "تم حذف المنتج بنجاح من المنصة",
        variant: "success",
      });
    } catch (err: any) {
      showNotification({
        message: err?.data?.message || "حدث خطأ أثناء محاولة حذف المنتج",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6 w-full font-sans select-none">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-dark">إدارة المنتجات العامة</h2>
          <p className="text-text-muted text-sm mt-1">مراقبة المنتجات المعروضة على المنصة وحظر المنتجات المخالفة.</p>
        </div>
      </div>

      {/* Sub-header mini stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="إجمالي المنتجات المسجلة"
          value={isLoading ? "..." : globalTotalProducts}
          icon={<Package className="w-5 h-5 text-primary" />}
          variant="default"
        />
        <StatCard
          title="المنتجات النشطة بالمنصة"
          value={isLoading ? "..." : globalActiveProducts}
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          variant="default"
        />
        <StatCard
          title="المنتجات منخفضة المخزون"
          value={isLoading || isAllProductsLoading ? "..." : globalLowStockCount}
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          variant="default"
        />
      </div>

      {/* Search & Filter section */}
      <ProductsFilter filters={filters} onChange={handleFilterChange} />

      {/* Products Table list */}
      {isError ? (
        <div className="w-full bg-white rounded-xl border-2 border-accent-light p-8 text-center text-red-500 font-medium">
          حدث خطأ أثناء تحميل البيانات من الخادم. يرجى المحاولة مرة أخرى لاحقاً.
        </div>
      ) : (
        <ProductsTable
          products={products}
          isLoading={isLoading || isFetching}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Pagination Footer */}
      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-6"
        />
      )}
    </div>
  );
}
export default AdminProducts;
