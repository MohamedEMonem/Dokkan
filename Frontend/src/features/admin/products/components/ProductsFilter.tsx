import { useListStoresQuery } from "@/api/store.api";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Select } from "@/components/ui/Select";

export interface ProductsFilterState {
  search: string;
  storeId: string;
  status: string;
  sortBy: string;
}

interface ProductsFilterProps {
  filters: ProductsFilterState;
  onChange: (filters: Partial<ProductsFilterState>) => void;
}

export function ProductsFilter({ filters, onChange }: ProductsFilterProps) {
  // Load stores list to filter by store
  const { data: storesResponse } = useListStoresQuery({ limit: 100 });
  const stores = storesResponse?.data?.stores || [];

  const storeOptions = stores.map((store) => ({
    value: store.id,
    label: store.name,
  }));

  const statusOptions = [
    { value: "Active", label: "نشط" },
    { value: "Inactive", label: "غير نشط" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث أولاً" },
    { value: "price_asc", label: "السعر: من الأقل للأعلى" },
    { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border-2 border-accent-light shadow-sm gap-4 flex flex-col md:flex-row md:items-center justify-between font-sans select-none w-full">
      {/* Search Input */}
      <div className="relative flex-1 min-w-60">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="ابحث باسم المنتج..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full pl-4 pr-10 py-2.5 text-xs md:text-sm bg-bg-cream/40 border-2 border-accent-light hover:border-accent focus:border-primary rounded-lg transition-all outline-none text-text-dark font-medium text-right"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Filter by Store */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-45">
          <span className="text-xs text-text-muted shrink-0">المتجر:</span>
          <Select
            value={filters.storeId}
            onChange={(e) => onChange({ storeId: e.target.value })}
            options={storeOptions}
            placeholder="كل المتاجر"
            className="w-full h-9! text-xs font-semibold"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-[140px]">
          <span className="text-xs text-text-muted shrink-0">الحالة:</span>
          <Select
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            options={statusOptions}
            placeholder="الكل"
            className="w-full h-9! text-xs font-semibold"
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-45">
          <span className="text-xs text-text-muted shrink-0 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> الترتيب:
          </span>
          <Select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value })}
            options={sortOptions}
            className="w-full h-9! text-xs font-semibold"
          />
        </div>
      </div>
    </div>
  );
}

