import { useEffect, useMemo, useRef, useState } from "react";

import { useAddItemMutation, useGetCartQuery } from "@/api/cart.api";

import { useGuestCartStorage } from "./useCartStorage";
import useCartService from "./useCartService";

export const readSession = () => {
  const token = localStorage.getItem("token");

  return {
    token,
    isAuthenticated: Boolean(token),
  };
};

export function useCartSession() {
  const [session, setSession] = useState(readSession);

  const { items: guestCart, clearGuestCart } = useGuestCartStorage();

  const { mergeGuestCartIntoBackend } = useCartService();

  const [addItemApi] = useAddItemMutation();

  const hasMergedRef = useRef(false);

  // Backend cart
  const { data: backendCartData, refetch } = useGetCartQuery(undefined, {
    skip: !session.isAuthenticated,
  });

  /**
   * Sync auth state
   */
  useEffect(() => {
    const syncSession = () => {
      setSession(readSession());
    };

    // same-tab auth update
    const handleAuthChanged = () => {
      syncSession();
    };

    // cross-tab auth update
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token") {
        syncSession();
      }
    };

    syncSession();

    window.addEventListener("storage", handleStorage);

    window.addEventListener("cart-auth-changed", handleAuthChanged);

    return () => {
      window.removeEventListener("storage", handleStorage);

      window.removeEventListener("cart-auth-changed", handleAuthChanged);
    };
  }, []);

  /**
   * Merge guest cart into backend after login
   */
  useEffect(() => {
    if (!session.isAuthenticated) {
      hasMergedRef.current = false;
      return;
    }

    if (hasMergedRef.current) return;

    if (!guestCart.length) return;

    hasMergedRef.current = true;

    const merge = async () => {
      try {
        await mergeGuestCartIntoBackend({
          items: guestCart,
          addToCartApi: (payload) => addItemApi(payload).unwrap(),
        });

        // clear local guest cart
        clearGuestCart();

        // refresh backend cart
        await refetch();
      } catch (error) {
        console.error("Cart merge failed", error);

        hasMergedRef.current = false;
      }
    };

    void merge();
  }, [
    session.isAuthenticated,
    guestCart,
    mergeGuestCartIntoBackend,
    addItemApi,
    clearGuestCart,
    refetch,
  ]);

  /**
   * Counts
   */
  const guestCount = useMemo(() => {
    return guestCart.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }, [guestCart]);

  const backendCount = useMemo(() => {
    return (
      backendCartData?.data?.stores?.reduce(
        (sum, store) =>
          sum +
          store.items.reduce(
            (storeCount, item) => storeCount + item.quantity,
            0,
          ),
        0,
      ) ?? 0
    );
  }, [backendCartData]);

  const cartCount = session.isAuthenticated ? backendCount : guestCount;

  return {
    isAuthenticated: session.isAuthenticated,
    cartCount,
    guestCount,
    backendCount,
  };
}
