import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ICategory } from "@/types/entities/category.types";
// eslint-disable-next-line react-refresh/only-export-components
export const mockCategories: ICategory[] = [
  { id: "electronics", name: "الإلكترونيات" },
  { id: "fashion", name: "الموضة والأزياء" },
  { id: "home", name: "المنزل والمعيشة" },
  { id: "beauty", name: "مستحضرات التجميل" },
  { id: "sports", name: "الرياضة" },
  { id: "books", name: "الكتب" },
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
          <FilterIcon />
          <h2>الفلاتر</h2>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <FilterSection title="بحث">
            <Input
              icon={<SearchIcon />}
              placeholder="ابحث عن منتج..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </FilterSection>

          {/* Category */}
          <FilterSection title="التصنيف">
            <div className="space-y-2">
              <RadioItem
                label="كل التصنيفات"
                name="category"
                value={category}
                setValue={setCategory}
              />
              <RadioItem
                label="الإلكترونيات"
                name="category"
                value={category}
                setValue={setCategory}
              />
              <RadioItem
                label="الموضة والأزياء"
                name="category"
                value={category}
                setValue={setCategory}
              />
              <RadioItem
                label="المنزل والمعيشة"
                name="category"
                value={category}
                setValue={setCategory}
              />
              <RadioItem
                label="مستحضرات التجميل"
                name="category"
                value={category}
                setValue={setCategory}
              />
              <RadioItem
                label="الرياضة"
                name="category"
                value={category}
                setValue={setCategory}
              />
              <RadioItem
                label="الكتب"
                name="category"
                value={category}
                setValue={setCategory}
              />
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
            onClick={() => {
              Reset();
            }}
            className="bg-bg-light! text-black! rounded-10 w-full! h-9!  border! outline-none! border-border-color! text-sm! focus:outline-none! focus:ring-0! hover:bg-accent! hover:text-white! transition-colors!"
          >
            إعادة تعيين الفلاتر
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default FilterAsideBar;

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-[#6B6B6B]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
  </svg>
);

const RadioItem = ({
  label,
  name,
  value,
  setValue,
}: {
  label: string;
  name: string;
  value: string;
  setValue: (val: string) => void;
}) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name={name}
      checked={
        label === "كل التصنيفات"
          ? value === "all"
          : value === mockCategories.find((cat) => cat.name === label)?.id
      }
      onChange={() => {
        // console.log(label);
        const category = mockCategories.find((cat) => cat.name === label);
        // console.log(category);
        setValue(category ? category.id : "all");
      }}
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
