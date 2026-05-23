import { Button } from "@/components/ui/Button";
import { ICartResponseItem } from "@/types/entities/cart.types";
import { Store, Minus, Plus, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  items: ICartResponseItem[];
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartList({ items, onQtyChange, onRemove }: Props) {
  if (!items || items.length === 0) return <div>No items</div>;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const [quantity, setQuantity] = useState(1);
  const mockCartItems = {
    store1: {
      id: "store1",
      name: "راحة المنزل",
      total: 171.05,
      totalShipping: 50,
      totalTax: 7,

      cartItems: {
        cart1: {
          productId: "37e230af-9cc1-4d4a-b1f4-588b73ed0f5f",
          title: "Sunglasses – UV400",
          imageUrl:
            "https://picsum.photos/seed/78ffc132-fafe-4420-a675-81c163587282img2/600/600",
          unitPrice: 19.81,
          quantity: 5,
          lineTotal: 99.05,
          inStock: true,
        },

        cart2: {
          productId: "456",
          title: "Product 2",
          imageUrl: "https://picsum.photos/seed/456/600/600",
          unitPrice: 15,
          quantity: 1,
          lineTotal: 15,
          inStock: false,
        },
      },
    },

    store2: {
      id: "store2",
      name: "Store 2",
      total: 15,
      totalShipping: 15,
      totalTax: 7,

      cartItems: {
        cart3: {
          productId: "789",
          title: "Product 3",
          imageUrl: "https://picsum.photos/seed/789/600/600",
          unitPrice: 5,
          quantity: 3,
          lineTotal: 15,
          inStock: true,
        },
      },
    },
  };

  const increaseQty = (productId: string, currentQty: number) => {
    const newQty = currentQty + 1;
    console.log("from increase method : ", newQty);
    onQtyChange(productId, newQty);
  };

  const decreaseQty = (productId: string, currentQty: number) => {
    if (currentQty <= 1) return;
    const newQty = currentQty - 1;
    console.log("from decrease method : ", newQty);
    onQtyChange(productId, newQty);
  };

  console.log("data :", mockCartItems);
  return (
    <div className="lg:col-span-2 space-y-6">
      {Object.entries(mockCartItems).map(([storeId, store]) => (
        <div
          key={storeId}
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
                  <h3 className="text-lg text-text-dark">{store.name}</h3>

                  <p className="text-sm text-gray-600">
                    {Object.values(store.cartItems).filter(Boolean).length} منتج
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="p-4 space-y-3">
            {Object.entries(store.cartItems).map(([cartId, item]) => (
              <div className="bg-gray-50 rounded-lg p-4" key={cartId}>
                <div className="flex gap-4">
                  <Link to={`/products/${item.productId}`}>
                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={item.imageUrl}
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
                      {item.lineTotal?.toFixed(2)} ج.م
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

          {/* Store Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>المجموع الفرعي للمتجر</span>
                <span>{store.total.toFixed(2)} ج.م</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>الشحن</span>
                <span
                  className={
                    store.total >= 500 ? "text-green-600 font-medium" : ""
                  }
                >
                  {store.total >= 500
                    ? "مجاني 🎉"
                    : `${store.totalShipping.toFixed(2)} ج.م`}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>الضريبة</span>
                <span>{store.totalTax.toFixed(2)} ج.م</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="text-text-dark font-medium">
                  إجمالي المتجر
                </span>

                <span className="text-primary font-medium">
                  {(store.total + store.totalShipping + store.totalTax).toFixed(
                    2,
                  )}{" "}
                  ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* info */}
      {Object.keys(mockCartItems).length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                شحن من عدة متاجر
              </p>
              <p className="text-xs text-blue-700">
                طلبك يحتوي على منتجات من 3 متاجر. سيتم شحن المنتجات من كل متجر
                بشكل منفصل وقد تصل في أوقات مختلفة.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
