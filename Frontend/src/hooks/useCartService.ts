import type { ICart } from "@/hooks/useCartStorage";
import { useGuestCartStorage } from "./useCartStorage";
import { showNotification } from "@/utils/showNotification";

export type AddItemParams = {
  item: ICart;
  isAuthenticated: boolean;
  addToCartApi?: (payload: {
    productId: string;
    quantity: number;
  }) => Promise<unknown>;
};

export type MergeGuestCartParams = {
  items: ICart[];
  addToCartApi: (payload: {
    productId: string;
    quantity: number;
  }) => Promise<unknown>;
};

export function useCartService() {
  const { items, saveGuestCart, clearGuestCart } = useGuestCartStorage();

  const addGuestCartItem = (item: ICart) => {
    const next = [...items];

    const existing = next.find((x) => x.productId === item.productId);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      next.push(item);
    }

    saveGuestCart(next);

    return next;
  };

  const addItemToCart = async ({
    item,
    isAuthenticated,
    addToCartApi,
  }: AddItemParams) => {
    if (isAuthenticated) {
      if (!addToCartApi)
        throw new Error("addToCartApi is required for authenticated users");
      await addToCartApi({
        productId: item.productId,
        quantity: item.quantity,
      });
    } else {
      addGuestCartItem(item);
    }
  };

  const mergeGuestCartIntoBackend = async ({
    items,
    addToCartApi,
  }: MergeGuestCartParams) => {
    if (!items.length) return;
    for (const item of items) {
      try {
        await addToCartApi({
          productId: item.productId,
          quantity: item.quantity,
        });
      } catch {
        showNotification({
          message: `Failed to merge item ${item.title} into backend cart`,
          variant: "error",
        });
      }
    }
    clearGuestCart();
  };

  return {
    addItemToCart,
    mergeGuestCartIntoBackend,
  } as const;
}

export default useCartService;
