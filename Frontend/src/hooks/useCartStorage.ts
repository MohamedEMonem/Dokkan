import { ICartResponseItem } from "@/types/entities/cart.types";
import { useCallback, useEffect, useState } from "react";

const CART_KEY = "cart";

const CART_UPDATED_EVENT = "cart-storage-updated";

const readGuestCart = (): ICartResponseItem[] => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? (JSON.parse(data) as ICartResponseItem[]) : [];
  } catch {
    return [];
  }
};

const setStore = (next: ICartResponseItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }

  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
};

export const useGuestCartStorage = () => {
  const [items, setItems] = useState<ICartResponseItem[]>(readGuestCart);

  useEffect(() => {
    const handleCartUpdate = () => {
      setItems(readGuestCart());
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, []);

  const loadGuestCart = useCallback(() => {
    return readGuestCart();
  }, []);

  const saveGuestCart = useCallback((cartItems: ICartResponseItem[]) => {
    setStore(cartItems);
    setItems(cartItems);
  }, []);

  const removeGuestCartItem = useCallback(
    (productId: string) => {
      const current = loadGuestCart();

      const next = current.filter((x) => x.productId !== productId);

      setStore(next);
      setItems(next);

      return next;
    },
    [loadGuestCart],
  );

  const clearGuestCart = useCallback(() => {
    try {
      localStorage.removeItem(CART_KEY);
    } catch {
      // ignore storage failures
    }

    setStore([]);
    setItems([]);
  }, []);

  return {
    items,
    saveGuestCart,
    loadGuestCart,
    removeGuestCartItem,
    clearGuestCart,
  };
};
