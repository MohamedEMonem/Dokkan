import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/api/product.api";
import { ProductForm } from "./components/ProductForm";
import { Loader2 } from "lucide-react";

export function UpdateProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: response, isLoading: isFetching, isError } = useGetProductByIdQuery({ id: id! }, { skip: !id });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const productData = response?.data;

  const handleSubmit = async (formData: FormData) => {
    try {
      if (!id) return;
      await updateProduct({ id, data: formData as any }).unwrap();
      toast.success("تم تحديث المنتج بنجاح!");
      navigate("/dashboard/products");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث المنتج. حاول مرة أخرى.");
      console.error("Update Product Error:", error);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !productData) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>فشل في تحميل بيانات المنتج أو المنتج غير موجود.</p>
        <button 
          onClick={() => navigate("/dashboard/products")}
          className="mt-4 text-primary underline"
        >
          العودة لقائمة المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <ProductForm initialData={productData} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
}
