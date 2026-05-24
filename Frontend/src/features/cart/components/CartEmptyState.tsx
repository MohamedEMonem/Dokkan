import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";

type CartEmptyStateProps = {
  onBrowseProducts: () => void;
};

export default function CartEmptyState({
  onBrowseProducts,
}: CartEmptyStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg p-12 shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="mb-4">سلة التسوق فارغة</h2>
          <p className="text-gray-600 mb-6">أضف بعض المنتجات للبدء!</p>
          <div className="flex justify-center">
            <Button
              variant="primary"
              className="px-5 w-fit! h-9! "
              onClick={onBrowseProducts}
            >
              تصفح المنتجات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
