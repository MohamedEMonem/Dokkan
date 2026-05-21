import { useEffect, useMemo, useState } from "react";
import FilterAsideBar from "../../components/ui/FilterAsideBar";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import StoreCard from "./Components/StoreCard";
import { sortBy } from "@/utils/sorting";
import { useListStoresQuery } from "@/api/store.api";
import { IStore } from "@/types/entities/store.types";

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const sortParam = searchParams.get("sort");

  const { data: stores, isLoading, error } = useListStoresQuery();

  type FiltersType = {
    search: string;
    category: string;
    city: string;
    rating: string;
    shipping: boolean;
    sort?: string;
    filter?: string;
  };

  type StoreItem = Partial<IStore> & Pick<IStore, "id">;

  const initialFilters: FiltersType = {
    search: "",
    category: "all",
    city: "all",
    rating: "all",
    shipping: false,
    sort: sortParam ?? "",
    filter: filterParam ?? "",
  };

  const [filters, setFilters] = useState<FiltersType>(initialFilters);

  useEffect(() => {
    if (sortParam) {
      // eslint-disable-next-line react-hooks/immutability, react-hooks/set-state-in-effect
      setFilters((prev) => ({ ...prev, sort: sortParam }));
    } else if (filterParam) {
      // eslint-disable-next-line react-hooks/immutability
      setFilters((prev) => ({ ...prev, filter: filterParam }));
    }
  }, [sortParam, filterParam]); // Run only on mount to check initial filters

  // debounce search to avoid filtering on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(
    initialFilters.search.trim().toLowerCase(),
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search.trim().toLowerCase());
    }, 250);
    return () => clearTimeout(t);
  }, [filters.search]);

  const filteredStores = useMemo(() => {
    const allStores = (stores?.data?.stores ?? []) as StoreItem[];
    const q = debouncedSearch;

    return allStores.filter((store) => {
      const name = store.name?.toLowerCase() ?? "";
      const desc = (store.description ?? "").toLowerCase();

      const matchesSearch = q === "" || name.includes(q) || desc.includes(q);

      return matchesSearch;
    });
  }, [stores, debouncedSearch]);

  const applySorting = useMemo(() => {
    return (storesArr: StoreItem[], sortedBy: string): StoreItem[] => {
      const config = sortConfigs[sortedBy];
      if (!config) return storesArr;

      if (!storesArr || storesArr.length <= 1) return storesArr;

      return [...storesArr].sort(
        // cast to any because store shape may be partial at runtime
        sortBy<StoreItem>(
          config.key as keyof StoreItem,
          config.order,
          config.type,
        ),
      );
    };
  }, []);

  const reset = () => setFilters(initialFilters);

  const displayedStores = useMemo(() => {
    const currentSort =
      filters.sort && sortConfigs[filters.sort] ? filters.sort : "new";
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
              {isLoading ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                  <p className="text-gray-600">جاري تحميل المحلات...</p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                  <p className="text-red-600">حدث خطأ أثناء تحميل المحلات.</p>
                </div>
              ) : displayedStores.length === 0 ? (
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
                  {displayedStores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ViewStores;
