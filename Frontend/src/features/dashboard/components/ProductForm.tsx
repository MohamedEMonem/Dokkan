import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { UploadCloud, CheckCircle, Plus } from "lucide-react";
import { IProduct, EProductStatus } from "@/types/entities/product.types";
import { useNavigate } from "react-router-dom";
import {
  productSchema,
  type ProductFormData,
} from "@/features/dashboard/schemas/product.schema";
import { useGetCategoriesQuery } from "@/api/category.api";
import { useMemo } from "react";

interface ProductFormProps {
  initialData?: Partial<IProduct>;
  onSubmit: (formData: FormData) => void;
  storeId?: string;
  isLoading?: boolean;
}

const DEFAULT_VALUES: ProductFormData = {
  title: "",
  price: 0,
  stockQuantity: 0,
  categoryId: "",
  status: EProductStatus.Active,
  description: "",
};


export const ProductForm = ({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>(new Array(6).fill(null));

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [previews, setPreviews] = useState<string[]>(new Array(6).fill(""));

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const categoryOptions = useMemo(() => {
    const categories = categoriesResponse?.data || [];
    return [
      { value: "", label: "اختر القسم" },
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    ];
  }, [categoriesResponse]);

  const handleUploadClick = (index: number) => {
    setActiveSlot(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || activeSlot === null) return;

    const incoming = Array.from(e.target.files).slice(0, 6 - activeSlot);

    setPreviews((prev) =>
      prev.map((url, i) => {
        const file = incoming[i - activeSlot];
        if (!file) return url;
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
        return URL.createObjectURL(file);
      })
    );

    setSelectedFiles((prev) =>
      prev.map((existing, i) => incoming[i - activeSlot] ?? existing)
    );

    setActiveSlot(null);
    e.target.value = "";
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...DEFAULT_VALUES, ...initialData },
  });

  const onFormSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    // Append all scalar fields (skip undefined/null)
    Object.entries({ ...initialData, ...data }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    // Attach the image file if one was selected
    const imageFile = selectedFiles[0];
    if (imageFile) formData.append("image", imageFile);
    onSubmit(formData);
  };

  const isPending = isLoading || isSubmitting;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-accent-light/50 overflow-hidden"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-primary p-6 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {initialData?.id ? "تعديل المنتج" : "إضافة منتج جديد"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        {/* Image Upload Area (Visual Mock) */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-text-dark flex items-center gap-2">
            صور المنتج (الحد الأقصى: 6 صور)
            <span className="text-red-500 font-bold">*</span>
          </label>

          <div className="space-y-4">
            {/* Main Image Slot */}
            <div className="relative group">
              {previews[0] || initialData?.images?.[0] ? (
                <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-accent-light bg-accent-light/10 shadow-sm">
                  <img
                    src={previews[0] || initialData?.images?.[0]?.imageUrl}
                    alt="الصورة الأساسية"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div 
                    onClick={() => handleUploadClick(0)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <div className="p-3 bg-white/90 text-primary rounded-full shadow-xl transition-transform hover:scale-110">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-white text-sm font-medium">تغيير الصورة</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">
                    الصورة الأساسية
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => handleUploadClick(0)}
                  className="border-2 border-dashed border-accent-light bg-[#fbf9f4] rounded-2xl h-64 flex flex-col items-center justify-center text-text-muted hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-10 h-10 text-primary" />
                  </div>
                  <p className="font-medium text-text-dark">
                    اسحب الصورة الأساسية هنا أو انقر للاختيار
                  </p>
                  <p className="text-xs mt-1 opacity-70">PNG, JPG, JPEG</p>
                </div>
              )}
            </div>

            {/* Thumbnail Slots (1-5) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, idx) => {
                const imgIndex = idx + 1;
                const preview = previews[imgIndex];
                const initialImg = initialData?.images?.[imgIndex];

                return (
                  <div key={idx} className="relative group aspect-square">
                    {preview || initialImg ? (
                      <div className="relative h-full w-full rounded-xl overflow-hidden border border-accent-light bg-accent-light/5 shadow-sm">
                        <img
                          src={preview || initialImg?.imageUrl}
                          alt={`صورة ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div 
                          onClick={() => handleUploadClick(imgIndex)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-pointer"
                        >
                          <div className="p-2 bg-white/90 text-primary rounded-full shadow-md">
                            <UploadCloud className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleUploadClick(imgIndex)}
                        className="h-full w-full border-2 border-dashed border-accent-light bg-[#fbf9f4] rounded-xl flex flex-col items-center justify-center text-accent-light hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                      >
                        <Plus className="w-6 h-6 group-hover:scale-110 group-hover:text-primary transition-all" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <Input
            label="اسم المنتج"
            required
            {...register("title")}
            placeholder="مثال: ساعة ذكية رياضية"
            className="border-accent-light"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="الكمية"
                required
                type="number"
                placeholder="50"
                step="1"
                min={0}
                max={1000}
                {...register("stockQuantity", { valueAsNumber: true })}
                className="border-accent-light text-right"
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="السعر (ج.م)"
                required
                type="number"
                placeholder="250"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="border-accent-light text-right"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <Select
            label="القسم"
            required
            {...register("categoryId")}
            options={categoryOptions}
            className="border-accent-light"
            disabled={isLoadingCategories}
          />
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categoryId.message}
            </p>
          )}

          <TextArea
            label="وصف المنتج"
            required
            {...register("description")}
            placeholder="اكتب وصفاً تفصيلياً للمنتج..."
            rows={4}
            className="border-accent-light"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-accent-light flex flex-col md:flex-row items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline-accent"
            className="w-full bg-white rounded-xl h-9!"
            onClick={() => navigate("/dashboard/products")}
            disabled={isPending}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-xl flex items-center justify-center gap-2 h-9!"
            disabled={isPending}
          >
            {isPending
              ? "جاري الحفظ..."
              : initialData?.id
                ? "حفظ التغييرات"
                : "إضافة المنتج"}
            {!isPending && <CheckCircle className="w-5 h-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
};
