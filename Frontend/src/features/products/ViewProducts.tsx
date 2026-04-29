import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/features/products/components/ProductCard";
import FilterAsideBar from "@/features/products/components/FilterAsideBar";
import { Select } from "@/components/ui/Select";
import { useGetProductsQuery } from "@/api/product.api";
import { Button } from "@/components/ui/Button";

export const ViewProducts = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  const products = data?.data ?? [];

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("cat");

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    city: "all",
    rating: "all",
    shipping: false,
  });

  const [sortedBy, setSortedBy] = useState("newest");

  useEffect(() => {
    console.log("Current Filters:", filters);
    console.log("Sorted By:", sortedBy);
  }, [filters, sortedBy]);

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    } else {
      setFilters((prev) => ({ ...prev, category: "all" }));
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        filters.search.trim() === "" ||
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === "all" || product.categoryId === filters.category;

      // Add more filters here as needed (city, rating, etc.)
      return matchesSearch && matchesCategory;
    });
  }, [products, filters]);

  const reset = () => {
    setFilters({
      search: "",
      category: "all",
      city: "all",
      rating: "all",
      shipping: false,
    });
    setSortedBy("newest");
  };

  return (
    <div className=" bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl">كل المنتجات</h1>
          <p className="text-gray-600">
            تم العثور على {filteredProducts.length} منتج
          </p>
        </div>
        <div className="flex gap-8">
          <FilterAsideBar
            filters={filters}
            setFilters={setFilters}
          />
          <div className="flex-1">
            {/* Bar */}
            <div className="h-18 flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">
                  الترتيب حسب:
                </span>

                <Select
                  value={sortedBy}
                  onChange={(val) => setSortedBy(val.target.value)}
                  options={[
                    { value: "newest", label: "الأحدث" },
                    {
                      value: "price_low_high",
                      label: "السعر من الأقل للأعلى",
                    },
                    {
                      value: "price_high_low",
                      label: "السعر من الأعلى للأقل",
                    },
                    { value: "highest_rated", label: "الأعلى تقييماً" },
                  ]}
                />
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                <p className="text-gray-600">جاري تحميل المنتجات...</p>
              </div>
            ) : error ? (
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
                  className="w-fit! h-9! px-4 py-2 rounded-lg text-black! border! outline-none! text-sm!  hover:text-white!"
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts &&
                  filteredProducts.map(
                    (p) => p && <ProductCard key={p.id} product={p} />,
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
