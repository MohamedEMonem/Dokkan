import { useGetCartQuery } from "@/api/cart.api";
import { useGuestCart } from "./useGuestCart";

export const readSession = () => {
  const token = localStorage.getItem("token");

  return {
    token,
    isAuthenticated: Boolean(token),
  };
};

export function useCartSession() {
  const { isAuthenticated } = readSession();
  const { items: guestCart } = useGuestCart();
  const { data: backendCartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const guestCount = guestCart.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );
  const backendCount =
    backendCartData?.data?.stores?.reduce(
      (sum, store) =>
        sum +
        store.items.reduce((storeCount, item) => storeCount + item.quantity, 0),
      0,
    ) ?? 0;

  return {
    isAuthenticated,
    // guestCount,
    // backendCount,
    cartCount: isAuthenticated ? backendCount : guestCount,
  };
}
