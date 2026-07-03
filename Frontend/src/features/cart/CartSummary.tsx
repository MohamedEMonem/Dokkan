import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

interface Props {
  itemCount: number;
  itemsTotal: number;
  shippingEstimate: number;
  taxEstimate: number;
  grandTotal: number;
}

export default function CartSummary({
  itemCount,
  itemsTotal,
  shippingEstimate,
  taxEstimate,
  grandTotal,
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
        <h2 className="mb-6">ملخص الطلب الإجمالي</h2>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>المجموع الفرعي ({itemCount} منتج)</span>
            <span>{itemsTotal.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>إجمالي الضريبة</span>
            <span>{taxEstimate.toFixed(2)} ج.م</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg">الإجمالي الكلي</span>
              <span className="text-xl text-primary font-medium">
                {grandTotal.toFixed(2)} ج.م
              </span>
            </div>
          </div>
        </div>
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            💡 الشحن يُحسب لكل متجر على حدة. احصل على شحن مجاني عند الشراء بـ
            500 ج.م أو أكثر من نفس المتجر.
          </p>
        </div>
        <Button
          variant="primary"
          className="h-10! mb-4! px-6!"
          onClick={() => {
            navigate("/checkout");
          }}
        >
          إتمام الطلب
        </Button>
        <Button
          variant="outline-accent"
          className="h-10! text-black border-gray-100!"
          onClick={() => navigate("/products")}
        >
          متابعة التسوق
        </Button>
      </div>
    </div>
  );
}
