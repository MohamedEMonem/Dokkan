import type { ICart } from "@/hooks/useCartStorage";
import { useGuestCart } from "./useGuestCart";
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
  const { addGuestCartItem, clearGuestCartStorage } = useGuestCart();

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
      } catch (err) {
        showNotification({
          message: `Failed to merge item ${item.title} into backend cart`,
          variant: "error",
        });
      }
      //   await addToCartApi({
      //     productId: item.productId,
      //     quantity: item.quantity,
      //   });
    }
    clearGuestCartStorage();
  };

  return {
    addItemToCart,
    mergeGuestCartIntoBackend,
  } as const;
}

export default useCartService;
