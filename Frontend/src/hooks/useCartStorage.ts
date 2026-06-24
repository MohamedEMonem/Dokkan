import { ICartResponseItem } from "@/types/entities/cart.types";
import { useEffect, useState } from "react";

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

const emitCartUpdate = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

const writeGuestCart = (items: ICartResponseItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }

  emitCartUpdate();
};

const clearGuestCartStorage = () => {
  try {
    localStorage.removeItem(CART_KEY);
  } catch {
    // ignore storage errors
  }

  emitCartUpdate();
};

export const useGuestCartStorage = () => {
  const [items, setItems] = useState<ICartResponseItem[]>(readGuestCart);

  useEffect(() => {
    const syncCart = () => {
      setItems(readGuestCart());
    };

    // same-tab updates
    window.addEventListener(CART_UPDATED_EVENT, syncCart);

    // cross-tab updates
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);

      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const saveGuestCart = (cartItems: ICartResponseItem[]) => {
    writeGuestCart(cartItems);
  };

  const removeGuestCartItem = (productId: string) => {
    const current = readGuestCart();

    const next = current.filter((x) => x.productId !== productId);

    writeGuestCart(next);

    return next;
  };

  const clearGuestCart = () => {
    clearGuestCartStorage();
  };

  return {
    items,

    loadGuestCart: readGuestCart,

    saveGuestCart,

    removeGuestCartItem,

    clearGuestCart,
  };
};
