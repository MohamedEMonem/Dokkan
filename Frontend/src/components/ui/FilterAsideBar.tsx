import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ICategory } from "@/types/entities/category.types";
import { Funnel, Search } from "lucide-react";
// eslint-disable-next-line react-refresh/only-export-components
export const mockCategories: ICategory[] = [
  { id: "electronics", name: "الإلكترونيات" },
  { id: "fashion", name: "الموضة والأزياء" },
  { id: "home", name: "المنزل والمعيشة" },
  { id: "beauty", name: "مستحضرات التجميل" },
  { id: "sports", name: "الرياضة" },
  { id: "books", name: "الكتب" },
];

const categoryOptions = [
  { id: "all", name: "كل التصنيفات" },
  ...mockCategories,
];

const cityOptions = [
  { value: "all", label: "كل المدن" },
  { value: "cairo", label: "القاهرة" },
  { value: "giza", label: "الجيزة" },
  { value: "alexandria", label: "الإسكندرية" },
  { value: "hurghada", label: "الغردقة" },
  { value: "sharm", label: "شرم الشيخ" },
];

const ratingOptions = [
  { value: "all", label: "كل التقييمات" },
  { value: "4", label: "فاعلي 4★" },
  { value: "4.5", label: "فاعلي 4.5★" },
];
//////////////////////////////////////////////////////////////////

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

// export default FilterAsideBar;

//////////////////////////////////////////////////////////////////

interface IProps {
  filters: {
    search: string;
    category: string;
    city: string;
    rating: string;
    shipping: boolean;
    sort?: string;
    filter?: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      search: string;
      category: string;
      city: string;
      rating: string;
      shipping: boolean;
      sort?: string;
      filter?: string;
    }>
  >;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterAsideBar = ({ filters, setFilters, isOpen, onClose }: IProps) => {
  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const Reset = () => {
    setFilters({
      search: "",
      category: "all",
      city: "all",
      rating: "all",
      shipping: false,
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out
          lg:static lg:block lg:translate-x-0 lg:bg-transparent lg:z-auto shrink-0
          ${isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"}
        `}
      >
        <div className="bg-white rounded-lg p-6 shadow-sm lg:sticky top-24 max-h-screen lg:max-h-[calc(100vh-7rem)] overflow-y-auto filter-scrollbar h-full lg:h-auto">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <Funnel className="w-5 h-5" strokeWidth={2} /> <h2>الفلاتر</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-md"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Search */}
            <FilterSection title="بحث">
              <Input
                icon={
                  <Search className="w-4 h-4 text-text-muted" strokeWidth={2} />
                }
                placeholder="ابحث عن منتج..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </FilterSection>

            {/* Category */}
            <FilterSection title="التصنيف">
              <div className="space-y-2">
                {categoryOptions.map((cat) => (
                  <RadioItem
                    key={cat.id}
                    label={cat.name}
                    itemId={cat.id}
                    name="category"
                    value={filters.category}
                    setValue={(val) => updateFilter("category", val)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Shipping */}
            <FilterSection title="الشحن">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                  checked={filters.shipping}
                  onChange={(e) => updateFilter("shipping", e.target.checked)}
                />
                <span className="text-sm">متاح الشحن</span>
              </label>
            </FilterSection>

            <FilterSection title="المدينة">
              <Select
                options={cityOptions}
                value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)}
              />
            </FilterSection>

            <FilterSection title="الحد الأدنى للتقييم">
              <Select
                options={ratingOptions}
                value={filters.rating}
                onChange={(e) => updateFilter("rating", e.target.value)}
              />
            </FilterSection>

            {/* Reset */}
            <Button
              variant="outline-accent"
              onClick={() => {
                Reset();
              }}
              className="text-black! h-9! border! outline-none text-sm! hover:text-white!"
            >
              إعادة تعيين الفلاتر
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterAsideBar;

const RadioItem = ({
  label,
  name,
  value,
  itemId,
  setValue,
}: {
  label: string;
  name: string;
  value: string;
  itemId: string;
  setValue: (val: string) => void;
}) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name={name}
      checked={value === itemId}
      onChange={() => setValue(itemId)}
      className="w-4 h-4 outline-none focus:outline-none focus:ring-0"
    />
    <span className="text-sm">{label}</span>
  </label>
);

const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div>
    <h3 className="mb-3">{title}</h3>
    {children}
  </div>
);
