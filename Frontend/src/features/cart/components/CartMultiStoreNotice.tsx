import { memo } from "react";
import { Package } from "lucide-react";

function CartMultiStoreNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 font-medium mb-1">
            شحن من عدة متاجر
          </p>
          <p className="text-xs text-blue-700">
            طلبك يحتوي على منتجات من عدة متاجر. سيتم شحن المنتجات من كل متجر
            بشكل منفصل وقد تصل في أوقات مختلفة.
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(CartMultiStoreNotice);
