import { useCallback } from "react";
import { ICart, useGuestCartStorage } from "./useCartStorage";

export const useGuestCart = () => {
  const { items, saveGuestCart, clearGuestCart } = useGuestCartStorage();

  const setGuestCart = useCallback(
    (cartItems: ICart[]) => {
      saveGuestCart(cartItems);
    },
    [saveGuestCart],
  );

  const addGuestCartItem = useCallback(
    (item: ICart) => {
      const next = [...items];

      const existing = next.find((x) => x.productId === item.productId);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        next.push(item);
      }

      saveGuestCart(next);

      return next;
    },
    [items, saveGuestCart],
  );

  const removeGuestCartItem = useCallback(
    (productId: string) => {
      const next = items.filter((x) => x.productId !== productId);

      saveGuestCart(next);

      return next;
    },
    [items, saveGuestCart],
  );

  return {
    items,
    setGuestCart,
    addGuestCartItem,
    removeGuestCartItem,
    clearGuestCartStorage: clearGuestCart,
  };
};
