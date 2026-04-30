import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "@/api/product.api";
import { ProductForm } from "./components/ProductForm";
import { IProduct } from "@/types/entities/product.types";

export function CreateProductPage() {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const testStoreId = "9aef3ee0-b640-4cfe-8e19-581326ceddac"; // Replace with auth logic later

  const handleSubmit = async (data: Partial<IProduct>) => {
    try {
      const payload = {
        ...data,
        storeId: testStoreId,
      };

      await createProduct(payload).unwrap();
      toast.success("تم إضافة المنتج بنجاح!");
      navigate("/dashboard/products");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة المنتج. حاول مرة أخرى.");
      console.error("Create Product Error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
