import { memo } from "react";

type CartStoreTotalsProps = {
  storeTotalWithoutTax: number;
  shippingFee: number;
  tax: number;
  storeTotal: number;
};

function CartStoreTotals({
  storeTotalWithoutTax,
  shippingFee,
  tax,
  storeTotal,
}: CartStoreTotalsProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>المجموع الفرعي للمتجر</span>
          <span>{storeTotalWithoutTax.toFixed(2)} ج.م</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>الشحن</span>
          <span>{shippingFee.toFixed(2)} ج.م</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>الضريبة</span>
          <span>{tax.toFixed(2)} ج.م</span>
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-300">
          <span className="text-text-dark font-medium">إجمالي المتجر</span>

          <span className="text-primary font-medium">
            {(storeTotal + shippingFee).toFixed(2)} ج.م
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(CartStoreTotals);
