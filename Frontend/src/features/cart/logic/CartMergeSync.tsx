import { useEffect, useRef, useState } from "react";
import { useAddItemMutation } from "@/api/cart.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart as clearGuestCart } from "./cartSlice";
import { mergeGuestCartIntoBackend } from "./cartService";
import { showNotification } from "@/utils/showNotification";

export default function CartMergeSync() {
  const [addItemApi] = useAddItemMutation();
  const dispatch = useAppDispatch();
  const guestCart = useAppSelector((state) => state.cart.items);
  const mergedGuestCartRef = useRef(false);
  const [authSignal, setAuthSignal] = useState(0);
  const hasAuthToken = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthSignal((value) => value + 1);
    };

    window.addEventListener("cart-auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("cart-auth-changed", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const syncGuestCart = async () => {
      if (!hasAuthToken) {
        mergedGuestCartRef.current = false;
        return;
      }

      if (mergedGuestCartRef.current || guestCart.length === 0) {
        return;
      }

      mergedGuestCartRef.current = true;

      try {
        await mergeGuestCartIntoBackend({
          items: guestCart,
          addToCartApi: (item) => addItemApi(item).unwrap(),
        });
        dispatch(clearGuestCart());
      } catch (error) {
        mergedGuestCartRef.current = false;
        showNotification({
          message: "فشل مزامنة سلة التسوق. يرجى المحاولة مرة أخرى.",
          variant: "error",
        });
        console.error("Failed to merge guest cart into backend", error);
      } finally {
        // Clear guest cart regardless of merge success to prevent stale data
        dispatch(clearGuestCart());
      }
    };

    void syncGuestCart();
  }, [addItemApi, authSignal, dispatch, guestCart, hasAuthToken]);

  return null;
}
