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
  selectedRating?: string;
  onRatingChange?: (value: string) => void;

  selectedCity?: string;
  onCityChange?: (value: string) => void;

  searchValue: string;
  setSearchValue: (val: string) => void;

  category: string;
  setCategory: (val: string) => void;

  shippingAvailable?: boolean;
  setShippingAvailable?: (val: boolean) => void;
}

const FilterAsideBar = ({
  searchValue,
  setSearchValue,
  category,
  setCategory,
  selectedRating,
  onRatingChange,
  selectedCity,
  onCityChange,
  shippingAvailable,
  setShippingAvailable,
}: IProps) => {
  const Reset = () => {
    onRatingChange?.("all");
    onCityChange?.("all");
    setSearchValue("");
    setCategory("all");
    setShippingAvailable?.(false);
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto filter-scrollbar">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Funnel className="w-5 h-5" strokeWidth={2} /> <h2>الفلاتر</h2>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <FilterSection title="بحث">
            <Input
              icon={<Search className="w-4 h-4 text-text-muted" strokeWidth={2} />}
              placeholder="ابحث عن منتج..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
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
                  value={category}
                  setValue={setCategory}
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
                checked={shippingAvailable}
                onChange={(e) =>
                  setShippingAvailable && setShippingAvailable(e.target.checked)
                }
              />
              <span className="text-sm">متاح الشحن</span>
            </label>
          </FilterSection>

          <FilterSection title="المدينة">
            <Select
              options={cityOptions}
              value={selectedCity ?? "all"}
              onChange={(e) => onCityChange?.(e.target.value)}
            />
          </FilterSection>

          <FilterSection title="الحد الأدنى للتقييم">
            <Select
              options={ratingOptions}
              value={selectedRating ?? "all"}
              onChange={(e) => onRatingChange?.(e.target.value)}
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
