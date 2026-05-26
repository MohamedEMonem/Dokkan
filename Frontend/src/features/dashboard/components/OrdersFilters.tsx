import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  fromDate: string;
  setFromDate: (v: string) => void;
  toDate: string;
  setToDate: (v: string) => void;
  paymentFilter: string;
  setPaymentFilter: (v: string) => void;
  setPage: (p: number) => void;
};

export default function OrdersFilters({
  searchQuery,
  setSearchQuery,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  paymentFilter,
  setPaymentFilter,
  setPage,
}: Props) {
  return (
    <div className="px-6 py-4 border-b border-accent-light bg-linear-to-l from-bg-cream to-white">
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1 min-w-0">
          <div className="relative">
            <Input
              icon={<Search className="w-4 h-4 text-text-muted" />}
              placeholder="رقم الطلب، اسم العميل، أو المنتج..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-3 md:mt-0">
          <span className="text-sm text-text-muted whitespace-nowrap">من:</span>
          <Input
            type="date"
            aria-label="من تاريخ"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
              setPage(1);
            }}
          />
          <span className="text-sm text-text-muted">إلى:</span>
          <Input
            type="date"
            aria-label="إلى تاريخ"
            value={toDate}
            onChange={(event) => {
              setToDate(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="w-full md:w-auto">
          <Select
            options={[
              { label: "كل حالات الدفع", value: "الكل" },
              { label: "مدفوع", value: "مدفوع" },
              { label: "غير مدفوع", value: "غير مدفوع" },
            ]}
            value={paymentFilter}
            onChange={(event) => {
              setPaymentFilter(event.target.value);
              setPage(1);
            }}
          ></Select>
        </div>
      </div>
    </div>
  );
}
