import { useNavigate } from "react-router-dom";
import { showNotification } from "@/utils/showNotification";
import { useCreateProductMutation } from "@/api/product.api";
import { useGetStoreQuery } from "@/api/store.api";
import { ProductForm } from "./components/ProductForm";

export function CreateProduct() {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: storeData } = useGetStoreQuery();

  const handleSubmit = async (formData: FormData) => {
    try {
      const storeId = storeData?.data?.store?.id;
      if (!storeId) {
        throw new Error("Store ID not found");
      }
      formData.append("storeId", storeId);
      await createProduct(formData as any).unwrap();      
      
      const productTitle = formData.get("title") as string;
      showNotification({
        message: `${productTitle}\nتم إضافة المنتج بنجاح!`,
        variant: "success",
      });
      navigate("/dashboard/products");
    } catch (error) {
      const productTitle = formData.get("title") as string;
      showNotification({
        message: `${productTitle}\nحدث خطأ أثناء إضافة المنتج. حاول مرة أخرى.`,
        variant: "error",
      });
      console.error("Create Product Error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
