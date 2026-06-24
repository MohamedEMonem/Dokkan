import { Search, ArrowUpDown } from "lucide-react";
import { Select } from "@/components/ui/Select";

export interface UsersFilterState {
  search: string;
  role: string;
  sortBy: string;
  sortDir: "asc" | "desc";
}

interface UsersFilterProps {
  filters: UsersFilterState;
  onChange: (filters: Partial<UsersFilterState>) => void;
}

export function UsersFilter({ filters, onChange }: UsersFilterProps) {
  const roleOptions = [
    { value: "Customer", label: "عميل" },
    { value: "StoreOwner", label: "صاحب متجر" },
    { value: "Admin", label: "مدير" },
  ];

  const sortOptions = [
    { value: "createdAt__desc", label: "الأحدث أولاً" },
    { value: "createdAt__asc", label: "الأقدم أولاً" },
    { value: "name__asc", label: "الاسم: أ → ي" },
    { value: "name__desc", label: "الاسم: ي → أ" },
    { value: "email__asc", label: "البريد: أبجدي" },
  ];

  const combinedSort = `${filters.sortBy}__${filters.sortDir}`;

  const handleSortChange = (value: string) => {
    const [sortBy, sortDir] = value.split("__") as [string, "asc" | "desc"];
    onChange({ sortBy, sortDir });
  };

  return (
    <div className="bg-white p-5 rounded-xl border-2 border-accent-light shadow-sm gap-4 flex flex-col md:flex-row md:items-center justify-between font-sans select-none w-full">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="ابحث بالاسم أو البريد الإلكتروني..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full pl-4 pr-10 py-2.5 text-xs md:text-sm bg-bg-cream/40 border-2 border-accent-light hover:border-accent focus:border-primary rounded-lg transition-all outline-none text-text-dark font-medium text-right"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Filter by Role */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-[180px]">
          <span className="text-xs text-text-muted shrink-0">الدور:</span>
          <Select
            value={filters.role}
            onChange={(e) => onChange({ role: e.target.value })}
            options={roleOptions}
            placeholder="كل الأدوار"
            className="w-full h-9! text-xs font-semibold"
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-[200px]">
          <span className="text-xs text-text-muted shrink-0 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> الترتيب:
          </span>
          <Select
            value={combinedSort}
            onChange={(e) => handleSortChange(e.target.value)}
            options={sortOptions}
            className="w-full h-9! text-xs font-semibold"
          />
        </div>
      </div>
    </div>
  );
}
