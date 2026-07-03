import { memo } from "react";
import { ICartStore } from "@/types/entities/cart.types";
import { Store, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2 } from "lucide-react";

const SHIPPING_FEE = 5;
const TAX_RATE = 0.14;

interface Props {
  stores: ICartStore[];
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

const CartList = ({ stores, onQtyChange, onRemove }: Props) => {
  const location = useLocation();

  // Extract subdomain from URL path
  const decodedPath = decodeURIComponent(location.pathname);
  const pathParts = decodedPath.split("/");
  const subdomain = pathParts[1];
  const isStoreRoute = !!subdomain && subdomain.startsWith("@");

  if (!stores || stores.length === 0) return <div>No items</div>;

  const storeTotals = stores.map((store) => {
    const storeTotalWithoutTax = store.items.reduce(
      (sum, item) => sum + (item.lineTotal ?? 0),
      0,
    );
    const itemCount = store.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      store,
      storeTotalWithoutTax,
      itemCount,
      tax: storeTotalWithoutTax * TAX_RATE,
    };
  });

  const handleIncrease = (productId: string, currentQty: number) => {
    onQtyChange(productId, currentQty + 1);
  };

  const handleDecrease = (productId: string, currentQty: number) => {
    if (currentQty <= 1) return;
    onQtyChange(productId, currentQty - 1);
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {storeTotals.map(({ store, storeTotalWithoutTax, itemCount, tax }) => (
        <div
          key={store.storeId}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
        >
          {!isStoreRoute && (
            <div className="bg-linear-to-l from-primary/5 to-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <Link to={`/@${store.subdomain}`}>
                      <h3 className="text-lg text-text-dark">
                        {store.storeName}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600">{itemCount} منتج</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 space-y-3">
            {store.items.map((item) => (
              <div key={item.productId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <Link
                    to={isStoreRoute ? `/${subdomain}/products/${item.productId}` : `/products/${item.productId}`}
                    className="shrink-0"
                    data-discover="true"
                  >
                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={item.imageUrl ?? undefined}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1">
                    <Link
                      to={isStoreRoute ? `/${subdomain}/products/${item.productId}` : `/products/${item.productId}`}
                      data-discover="true"
                    >
                      <h4 className="mb-1 hover:text-blue-600 text-text-dark">
                        {item.title}
                      </h4>
                    </Link>

                    <div className="text-lg text-primary mb-4">
                      {item.unitPrice?.toFixed(2)} ج.م
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center  rounded-lg bg-white">
                        <Button
                          variant="outline-accent"
                          className={`w-9! h-8! border-none! ${item.quantity <= 1 ? "cursor-not-allowed opacity-50" : ""}`}
                          onClick={() =>
                            handleDecrease(item.productId, item.quantity)
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
                            handleIncrease(item.productId, item.quantity)
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end text-left pl-1">
                    <div className="text-lg text-text-dark">
                      {item.lineTotal?.toFixed(2)} ج.م
                    </div>
                    <Button
                      className="px-3! h-8! text-red-600 hover:text-red-700 hover:bg-red-50"
                      icon={<Trash2 className="w-4 h-4" />}
                      variant="tertiary"
                      onClick={() => onRemove(item.productId)}
                    >
                      حذف
                    </Button>
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
                <span>الضريبة</span>
                <span>{tax.toFixed(2)} ج.م</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="text-text-dark font-medium">
                  إجمالي المتجر
                </span>

                <span className="text-primary font-medium">
                  {(storeTotalWithoutTax + SHIPPING_FEE + tax).toFixed(2)} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {stores.length > 1 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <Package className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
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
      ) : null}
    </div>
  );
};

export default memo(CartList);
