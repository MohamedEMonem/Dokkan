import { useNavigate } from "react-router-dom";
import {
  useGetCartQuery,
  useUpdateItemMutation,
  useRemoveItemMutation,
  // useClearCartMutation,
} from "@/api/cart.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCart } from "./logic/cartSlice";
import type {
  ICartResponse,
  ICartResponseItem,
} from "@/types/entities/cart.types";
import CartList from "@/features/cart/CartList";
import CartSummary from "@/features/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateItemMutation();
  const [removeItem] = useRemoveItemMutation();
  // const [clearCart] = useClearCartMutation();
  const dispatch = useAppDispatch();
  const guestCart = useAppSelector((s) => s.cart.items);

  const cart = data?.data as ICartResponse | undefined;

  const guestItems: ICartResponseItem[] = guestCart.map((it) => {
    const itm = it as ICartResponseItem;
    const unitPrice = Number(itm.unitPrice ?? 0) || 0;
    const qty = itm.quantity ?? 0;
    const title: string =
      typeof itm.title === "string" ? itm.title : "Unknown product";
    const maybeImage = (itm as unknown as { imageUrl?: unknown }).imageUrl;
    const imageUrl: string | undefined =
      typeof maybeImage === "string" ? maybeImage : undefined;
    return {
      productId: itm.productId,
      title,
      imageUrl,
      unitPrice,
      quantity: qty,
      lineTotal: unitPrice * qty,
      inStock: true,
    };
  });

  const guestItemsTotal = guestItems.reduce((s, i) => s + i.lineTotal!, 0);

  const effectiveCart: ICartResponse =
    cart ??
    ({
      items: guestItems,
      itemsTotal: guestItemsTotal,
      shippingEstimate: 0,
      grandTotal: guestItemsTotal,
    } as ICartResponse);

  const effectiveItems: ICartResponseItem[] = cart
    ? cart.items.map((it) => ({
        productId: it.productId,
        title: it.title,
        imageUrl: it.imageUrl ?? undefined,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        lineTotal:
          typeof it.lineTotal === "number"
            ? it.lineTotal
            : it.unitPrice * it.quantity,
        inStock: !!it.inStock,
      }))
    : guestItems;

  if (isLoading) return <div>Loading cart...</div>;

  if (
    !effectiveCart ||
    !effectiveCart.items ||
    effectiveCart.items.length === 0
  ) {
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
                onClick={() => navigate("/products")}
              >
                تصفح المنتجات
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleQtyChange = (productId: string, qty: number) => {
    if (cart) updateItem({ productId, quantity: qty });
    else {
      if (qty <= 0) {
        dispatch({ type: "cart/removeFromCart", payload: productId });
        return;
      }
      const updated = guestCart.map((it) =>
        it.productId === productId ? { ...it, quantity: qty } : it,
      );
      dispatch(setCart(updated));
    }
  };

  const handleRemove = (productId: string) => {
    if (cart) removeItem({ productId });
    else dispatch({ type: "cart/removeFromCart", payload: productId });
  };

  // const handleCheckout = () => {
  //   navigate("/checkout");
  // };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <h1 className="mb-8">سلة التسوق (1 منتج)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <CartList
            items={effectiveItems}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
          />
          <CartSummary
          // itemsTotal={effectiveCart.itemsTotal || 0}
          // shippingEstimate={effectiveCart.shippingEstimate || 0}
          // grandTotal={effectiveCart.grandTotal || 0}
          />
        </div>
      </div>
    </div>
  );
}
