import { ICartResponseItem } from "@/types/entities/cart.types";
import { useGuestCartStorage } from "./useCartStorage";
import { showNotification } from "@/utils/showNotification";

export const CART_MERGED_EVENT = "cart-merged";

export type AddItemParams = {
  item: ICartResponseItem;
  isAuthenticated: boolean;
  addToCartApi?: (payload: {
    productId: string;
    quantity: number;
  }) => Promise<unknown>;
};

export type MergeGuestCartParams = {
  items: ICartResponseItem[];
  addToCartApi: (payload: {
    productId: string;
    quantity: number;
  }) => Promise<unknown>;
};

export const useCartService = () => {
  const { items, saveGuestCart, clearGuestCart } = useGuestCartStorage();

  const addGuestCartItem = (item: ICartResponseItem) => {
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

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(CART_MERGED_EVENT));
    }
  };

  return {
    addItemToCart,
    mergeGuestCartIntoBackend,
  } as const;
};

export default useCartService;
