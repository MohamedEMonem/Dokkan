import { useGetCartQuery } from "@/api/cart.api";
import { useGuestCartStorage } from "./useCartStorage";

export const readSession = () => {
  const token = localStorage.getItem("token");

  return {
    token,
    isAuthenticated: Boolean(token),
  };
};

export function useCartSession() {
  const { isAuthenticated } = readSession();
  const { items: guestCart } = useGuestCartStorage();
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

  const cartCount = isAuthenticated ? backendCount : guestCount;

  return {
    isAuthenticated,
    // guestCount,
    // backendCount,
    cartCount,
  };
}
