import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetCartQuery,
  useUpdateItemMutation,
  useRemoveItemMutation,
} from "@/api/cart.api";
import type {
  ICartResponse,
  ICartResponseItem,
  ICartStore,
} from "@/types/entities/cart.types";
import CartList from "./CartList.tsx";
import CartSummary from "@/features/cart/CartSummary";
import { useGuestCartStorage } from "@/hooks/useCartStorage";
import { readSession } from "@/hooks/useCartSession";
import { CART_MERGED_EVENT } from "@/hooks/useCartService";
import CartEmptyState from "./components/CartEmptyState";

const SHIPPING_FEE = 5;
const TAX_RATE = 0.14;

const normalizeGuestCartItem = (item: unknown): ICartResponseItem => {
  const itm = item as ICartResponseItem;
  const unitPrice = Number(itm.unitPrice ?? 0) || 0;
  const quantity = itm.quantity ?? 0;
  const title = typeof itm.title === "string" ? itm.title : "Unknown product";
  const maybeImage = (itm as unknown as { imageUrl?: unknown }).imageUrl;
  const imageUrl = typeof maybeImage === "string" ? maybeImage : undefined;

  return {
    productId: itm.productId,
    title,
    imageUrl: imageUrl ?? null,
    unitPrice,
    quantity,
    lineTotal: Number((unitPrice * quantity).toFixed(2)),
    inStock: true,
  };
};

export default function CartPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => readSession().isAuthenticated,
  );

  // API cart state
  const { data, isLoading, refetch } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateItem] = useUpdateItemMutation();
  const [removeItem] = useRemoveItemMutation();

  // Guest cart state
  const {
    items: guestCart,
    saveGuestCart: setGuestCart,
    removeGuestCartItem,
  } = useGuestCartStorage();

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(readSession().isAuthenticated);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token") {
        syncAuth();
      }
    };

    const handleCartMerged = () => {
      const authed = readSession().isAuthenticated;
      setIsAuthenticated(authed);

      if (authed) {
        void refetch();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cart-auth-changed", syncAuth);
    window.addEventListener(CART_MERGED_EVENT, handleCartMerged);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cart-auth-changed", syncAuth);
      window.removeEventListener(CART_MERGED_EVENT, handleCartMerged);
    };
  }, [refetch]);

  const cart = data?.data;

  const guestItems = useMemo(
    () => guestCart.map(normalizeGuestCartItem),
    [guestCart],
  );

  const guestItemsTotal = useMemo(
    () =>
      Number(
        guestItems
          .reduce((sum, item) => sum + (item.lineTotal ?? 0), 0)
          .toFixed(2),
      ),
    [guestItems],
  );

  const guestStores = useMemo<ICartStore[]>(
    () =>
      guestItems.length
        ? [
            {
              storeId: "guest-cart",
              storeName: "المنتجات المحفوظة",
              subdomain: "",
              items: guestItems,
              storeTotal: Number(
                (guestItemsTotal + guestItemsTotal * TAX_RATE).toFixed(2),
              ),
            },
          ]
        : [],
    [guestItems, guestItemsTotal],
  );

  const guestShippingEstimate = useMemo(
    () => Number((guestStores.length * SHIPPING_FEE).toFixed(2)),
    [guestStores.length],
  );

  const guestTaxEstimate = useMemo(
    () =>
      Number(
        guestStores
          .reduce(
            (sum, store) =>
              sum +
              store.items.reduce(
                (storeSum, item) => storeSum + (item.lineTotal ?? 0),
                0,
              ) *
                TAX_RATE,
            0,
          )
          .toFixed(2),
      ),
    [guestStores],
  );

  const guestGrandTotal = useMemo(
    () =>
      Number(
        (guestItemsTotal + guestTaxEstimate + guestShippingEstimate).toFixed(2),
      ),
    [guestItemsTotal, guestTaxEstimate, guestShippingEstimate],
  );

  const effectiveCart: ICartResponse = useMemo(
    () =>
      cart ?? {
        stores: guestStores,
        itemsTotal: guestItemsTotal,
        shippingEstimate: guestShippingEstimate,
        taxEstimate: guestTaxEstimate,
        grandTotal: guestGrandTotal,
      },
    [
      cart,
      guestGrandTotal,
      guestItemsTotal,
      guestShippingEstimate,
      guestStores,
      guestTaxEstimate,
    ],
  );

  const effectiveStores = cart?.stores ?? guestStores;
  const totalItemCount = useMemo(
    () =>
      effectiveStores.reduce(
        (storeTotal, store) =>
          storeTotal +
          store.items.reduce((count, item) => count + item.quantity, 0),
        0,
      ),
    [effectiveStores],
  );

  const handleQtyChange = useCallback(
    (productId: string, qty: number) => {
      if (cart) {
        updateItem({ productId, quantity: qty });
        return;
      }

      if (qty <= 0) {
        removeGuestCartItem(productId);
        return;
      }

      const updated = guestCart.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item,
      );
      setGuestCart(updated);
    },
    [cart, guestCart, removeGuestCartItem, setGuestCart, updateItem],
  );

  const handleRemove = useCallback(
    (productId: string) => {
      if (cart) removeItem({ productId });
      else removeGuestCartItem(productId);
    },
    [cart, removeGuestCartItem, removeItem],
  );

  if (isLoading) return <div>Loading cart...</div>;

  if (
    !effectiveStores.length ||
    effectiveStores.every((store) => store.items.length === 0)
  ) {
    return <CartEmptyState onBrowseProducts={() => navigate("/products")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <h1 className="mb-8">سلة التسوق ({totalItemCount} منتج)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <CartList
            stores={effectiveStores}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
          />
          <CartSummary
            itemCount={totalItemCount}
            itemsTotal={effectiveCart.itemsTotal || 0}
            shippingEstimate={effectiveCart.shippingEstimate || 0}
            taxEstimate={effectiveCart.taxEstimate || 0}
            grandTotal={effectiveCart.grandTotal || 0}
          />
        </div>
      </div>
    </div>
  );
}
