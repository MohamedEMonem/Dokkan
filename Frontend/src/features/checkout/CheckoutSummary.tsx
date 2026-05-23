import { Button } from "@/components/ui/Button";
// import { ICartResponse } from "@/types/entities/cart.types";
interface ICartResponse {
  items: {
    title: string;
    quantity: number;
    lineTotal: number;
  }[];
  itemsTotal: number;
  shippingEstimate: number;
  tax?: number;
  grandTotal: number;
}
interface Props {
  cartItems: ICartResponse;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function CheckoutSummary({
  cartItems: cart,
  onConfirm,
  isLoading,
}: Props) {
  if (!cart) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
      <h2 className="mb-6">ملخص الطلب</h2>
      <div className="space-y-3 mb-6">
        {cart.items.length > 0 ? (
          cart.items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-600">
                {item.title} × {item.quantity}
              </span>
              <span>{item.lineTotal.toFixed(2)} ج.م</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">لا توجد عناصر في السلة.</p>
        )}
      </div>
      <div className="border-t border-t-gray-300 pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>المجموع الفرعي</span>
          <span>{cart.itemsTotal.toFixed(2)} ج.م</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>الشحن</span>
          <span>{cart.shippingEstimate.toFixed(2)} ج.م</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>الضريبة</span>
          <span>{cart.tax?.toFixed(2) || "0.00"} ج.م</span>
        </div>
        <div className="border-t-gray-300 border-t pt-3">
          <div className="flex justify-between">
            <span>الإجمالي</span>
            <span className="text-xl text-blue-600">
              {cart.grandTotal.toFixed(2)} ج.م
            </span>
          </div>
        </div>
      </div>

      <Button
        data-slot="button"
        className="h-10! px-6! mt-6!"
        type="button"
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? "جاري المعالجة..." : "تأكيد الطلب"}
      </Button>
      <p className="text-xs text-gray-500 text-center mt-4">
        بتقديم طلبك، فإنك توافق على شروط الخدمة وسياسة الخصوصية
      </p>
    </div>
  );
}
