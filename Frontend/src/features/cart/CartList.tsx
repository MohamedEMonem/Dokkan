import { Button } from "@/components/ui/Button";
import { ICartStore } from "@/types/entities/cart.types";
import { Store, Minus, Plus, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  stores: ICartStore[];
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartList({ stores, onQtyChange, onRemove }: Props) {
  if (!stores || stores.length === 0) return <div>No items</div>;

  const increaseQty = (productId: string, currentQty: number) => {
    const newQty = currentQty + 1;
    onQtyChange(productId, newQty);
  };

  const decreaseQty = (productId: string, currentQty: number) => {
    if (currentQty <= 1) return;
    const newQty = currentQty - 1;
    onQtyChange(productId, newQty);
  };

  const SHIPPING_FEE = 5;
  const TAX_RATE = 0.14;

  return (
    <div className="lg:col-span-2 space-y-6">
      {stores.map((store) => {
        const shipping = store.storeTotal >= 500 ? 0 : SHIPPING_FEE;
        const storeTotalWithoutTax = store.items.reduce(
          (sum, item) => sum + (item.lineTotal ?? 0),
          0,
        );
        const tax = storeTotalWithoutTax * TAX_RATE;
        return (
          <div
            key={store.storeId}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
          >
            {/* Store Header */}
            <div className="bg-linear-to-l from-primary/5 to-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <Link to={`/@${store.storeId}`}>
                      <h3 className="text-lg text-text-dark">
                        {store.storeName}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600">
                      {store.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}{" "}
                      منتج
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {store.items.map((item) => (
                <div className="bg-gray-50 rounded-lg p-4" key={item.productId}>
                  <div className="flex gap-4">
                    <Link to={`/products/${item.productId}`}>
                      <div className="w-24 h-24 bg-white rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={item.imageUrl ?? undefined}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1">
                      <Link to={`/products/${item.productId}`}>
                        <h4 className="mb-1 hover:text-blue-600 text-text-dark">
                          {item.title}
                        </h4>
                      </Link>

                      <div className="text-lg text-primary mb-4">
                        {item.unitPrice?.toFixed(2)} ج.م
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg bg-white border-gray-300">
                          <Button
                            variant="outline-accent"
                            className={`w-9! h-8! border-none! ${item.quantity <= 1 ? "cursor-not-allowed opacity-50" : ""}`}
                            onClick={() =>
                              decreaseQty(item.productId, item.quantity)
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>

                          <span className="px-4 py-1 min-w-12 text-center inline-block">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline-accent"
                            className="w-9! h-8! border-none!"
                            onClick={() =>
                              increaseQty(item.productId, item.quantity)
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          className="w-20! px-3! h-8! text-red-500 hover:bg-red-50! border-red-500!"
                          icon={<Trash2 className="w-4 h-4" />}
                          variant="tertiary"
                          onClick={() => onRemove(item.productId)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-lg text-text-dark">
                        {item.lineTotal?.toFixed(2)} ج.م
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي للمتجر</span>
                  <span>{storeTotalWithoutTax.toFixed(2)} ج.م</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span
                  // className={
                  //   shipping === 0 ? "text-green-600 font-medium" : ""
                  // }
                  >
                    {/* {shipping === 0 ? "مجاني 🎉" : `${shipping.toFixed(2)} ج.م`} */}
                    {SHIPPING_FEE.toFixed(2)} ج.م
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>الضريبة</span>
                  <span>{tax.toFixed(2)} ج.م</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="text-text-dark font-medium">
                    إجمالي المتجر
                  </span>

                  <span className="text-primary font-medium">
                    {store.storeTotal.toFixed(2)} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {stores.length > 1 && (
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
      )}
    </div>
  );
}
