import { useEffect, useMemo, useState } from "react";
import FilterAsideBar from "../products/components/FilterAsideBar";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { mockStoresData } from "./Mock";
import StoreCard from "./Components/StoreCard";
import { sortBy } from "@/utils/sorting";

const sortConfigs: Record<
  string,
  { key: string; order: "asc" | "desc"; type?: "number" | "date" }
> = {
  special: { key: "isFeatured", order: "desc", type: "number" },
  new: { key: "createdAt", order: "desc", type: "date" },
  top: { key: "rating", order: "desc", type: "number" },
  best_selling: { key: "salesCount", order: "desc", type: "number" },
  most_popular: { key: "popularity", order: "desc", type: "number" },
};

const ViewStores = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const sortParam = searchParams.get("sort");
  // Initialize filters.sort from query params when present

  const stores = mockStoresData; // Replace with actual data fetching logic

  type Store = (typeof mockStoresData)[number];

  type FiltersType = {
    search: string;
    category: string;
    city: string;
    rating: string;
    shipping: boolean;
    sort?: string;
    filter?: string;
  };

  const initialFilters: FiltersType = {
    search: "",
    category: "all",
    city: "all",
    rating: "all",
    shipping: false,
    sort: sortParam ?? "",
    filter: filterParam ?? "",
  };
  useEffect(() => {
    if (sortParam) {
      // eslint-disable-next-line react-hooks/immutability
      setFilters((prev) => ({ ...prev, sort: sortParam }));
    }
  }, [sortParam]); // Run only on mount to check initial filters
  const [filters, setFilters] = useState<FiltersType>(initialFilters);

  useEffect(() => {
    console.log("filters:", filters);
    console.log("stores:", stores);

  }, [filters, stores]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch =
        filters.search.trim() === "" ||
        store.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        store.description?.toLowerCase().includes(filters.search.toLowerCase());

      // Category filter placeholder - will use when categories are added to mock data
      // const matchesCategory = filters.category === "all";

      return matchesSearch;
    });
  }, [stores, filters]);

  const applySorting = useMemo(() => {
    return (stores: Store[], sortedBy: string): Store[] => {
      const config = sortConfigs[sortedBy];
      if (!config) return stores;

      return [...stores].sort(
        sortBy(config.key as never, config.order, config.type),
      );
    };
  }, []);

  const displayedStores = useMemo(() => {
    const currentSort = filters.sort || "new";
    console.log("current sort: " + currentSort);
    return applySorting(filteredStores, currentSort);
  }, [filteredStores, filters.sort, applySorting]);

  return (
    <>
      <div className=" bg-gray-50 py-8" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            {filters.search.length > 0 ? (
              <p className="mb-2 text-2xl">
                نتائج البحث عن
                <span className="font-semibold">{` "${filters.search}"`}</span>
              </p>
            ) : (
              <h1 className="mb-2 text-2xl">كل المحلات</h1>
            )}
            <p className="text-gray-600">
              تم العثور على {displayedStores.length} متجر
            </p>
          </div>

          <div className="flex gap-8">
            <FilterAsideBar
              filters={filters}
              setFilters={setFilters}
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
            />

            <div className="flex-1 w-full lg:w-auto">
              {/* Bar */}
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between mb-8 gap-4">
                {/* Filter Button (Mobile Only) */}
                <div className="flex items-center lg:hidden">
                  <Button
                    variant="outline-accent"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="h-9! items-center gap-2 px-4 py-2.5 border! text-gray-700!"
                    icon={
                      <SlidersHorizontal size={18} className="text-gray-500" />
                    }
                    iconPos="right"
                  >
                    <span className="text-sm font-medium">الفلاتر</span>
                  </Button>
                </div>

                {/* Sort Section */}
                <div className="flex items-center gap-3 shrink-0">
                  <Select
                    value={filters.sort || "new"}
                    onChange={(val) =>
                      setFilters((prev) => ({
                        ...prev,
                        sort: val.target.value,
                      }))
                    }
                    options={[
                      { value: "special", label: "مميز" },
                      { value: "new", label: "الأحدث" },
                      { value: "top", label: "الأعلى تقييماً" },
                      {
                        value: "best_selling",
                        label: "الأكثر مبيعاً",
                      },
                      {
                        value: "most_popular",
                        label: "الأكثر شعبية",
                      },
                    ]}
                    className="h-9! px-4! lg:h-12! lg:px-12!"
                  />
                </div>
              </div>

              {/* stores Grid */}
              {/* {isLoading ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                  <p className="text-gray-600">جاري تحميل المحلات...</p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                  <p className="text-red-600">حدث خطأ أثناء تحميل المحلات.</p>
                </div>
              ) : filteredStores.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-sm flex flex-col items-center">
                  <p className="text-gray-600 mb-4">
                    لم يتم العثور على محلات تطابق معاييرك.
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {displayedStores.map((s) =>
                    s ? <StoreCard key={s.id} {...s} /> : null,
                  )}
                </div>
              )} */}

              {/*Temp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedStores &&
                  displayedStores.map(
                    (s) => s && <StoreCard key={s.id} store={s} />,
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ViewStores;
