import { useNavigate } from "react-router-dom";
import { showNotification } from "@/utils/showNotification";
import { useCreateProductMutation } from "@/api/product.api";
import { ProductForm } from "./components/ProductForm";

const TEST_STORE_ID = "9aef3ee0-b640-4cfe-8e19-581326ceddac"; // Replace with auth later

export function CreateProductPage() {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      formData.append("storeId", TEST_STORE_ID);
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
