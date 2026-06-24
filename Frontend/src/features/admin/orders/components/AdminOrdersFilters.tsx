import { Search, ArrowUpDown } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { EOrderStatus, EPaymentStatus } from "@/types/entities/order.types";

export interface AdminOrdersFilterState {
  search: string;
  status: string;
  paymentStatus: string;
  sortBy: string;
  sortDir: "asc" | "desc";
}

interface AdminOrdersFiltersProps {
  filters: AdminOrdersFilterState;
  onChange: (filters: Partial<AdminOrdersFilterState>) => void;
}

export function AdminOrdersFilters({ filters, onChange }: AdminOrdersFiltersProps) {
  const statusOptions = [
    { value: "", label: "كل حالات الطلب" },
    { value: EOrderStatus.Pending, label: "قيد الانتظار" },
    { value: EOrderStatus.Shipped, label: "تم الشحن" },
    { value: EOrderStatus.Delivered, label: "تم التوصيل" },
    { value: EOrderStatus.Cancelled, label: "ملغي" },
  ];

  const paymentStatusOptions = [
    { value: "", label: "كل حالات الدفع" },
    { value: EPaymentStatus.Pending, label: "قيد الانتظار" },
    { value: EPaymentStatus.Success, label: "مدفوع" },
    { value: EPaymentStatus.Failed, label: "فشل الدفع" },
  ];

  const sortOptions = [
    { value: "createdAt__desc", label: "الأحدث أولاً" },
    { value: "createdAt__asc", label: "الأقدم أولاً" },
    { value: "totalAmount__desc", label: "الإجمالي: من الأعلى للأقل" },
    { value: "totalAmount__asc", label: "الإجمالي: من الأقل للأعلى" },
  ];

  const combinedSort = `${filters.sortBy}__${filters.sortDir}`;

  const handleSortChange = (value: string) => {
    const [sortBy, sortDir] = value.split("__") as [string, "asc" | "desc"];
    onChange({ sortBy, sortDir });
  };

  return (
    <div className="bg-white p-5 rounded-xl border-2 border-accent-light shadow-sm gap-4 flex flex-col xl:flex-row xl:items-center justify-between font-sans select-none w-full">
      {/* Search Input */}
      <div className="relative flex-1 min-w-60">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="ابحث برقم الطلب، اسم العميل، أو اسم المتجر..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full pl-4 pr-10 py-2.5 text-xs md:text-sm bg-bg-cream/40 border-2 border-accent-light hover:border-accent focus:border-primary rounded-lg transition-all outline-none text-text-dark font-medium text-right"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
        {/* Filter by Order Status */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-40">
          <span className="text-xs text-text-muted shrink-0">حالة الطلب:</span>
          <Select
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            options={statusOptions}
            placeholder="حالة الطلب"
            className="w-full h-9! text-xs font-semibold"
          />
        </div>

        {/* Filter by Payment Status */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-40">
          <span className="text-xs text-text-muted shrink-0">حالة الدفع:</span>
          <Select
            value={filters.paymentStatus}
            onChange={(e) => onChange({ paymentStatus: e.target.value })}
            options={paymentStatusOptions}
            placeholder="حالة الدفع"
            className="w-full h-9! text-xs font-semibold"
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-50">
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
