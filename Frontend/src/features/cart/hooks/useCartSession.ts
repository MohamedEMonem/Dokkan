import { useEffect, useState } from "react";

import { useGetCartQuery } from "@/api/cart.api";
import { useAppSelector } from "@/store/hooks";

interface UserType {
  name?: string;
  profilePhotoUrl?: string;
  email?: string;
  role?: string;
}

const readSession = () => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user: UserType | null = userRaw
    ? (JSON.parse(userRaw) as UserType)
    : null;

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user?.role),
  };
};

export function useCartSession() {
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthVersion((value) => value + 1);
    };

    window.addEventListener("cart-auth-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("cart-auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const { user, isAuthenticated } = readSession();
  const guestCart = useAppSelector((state) => state.cart.items ?? []);

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
    user,
    isAuthenticated,
    guestCount,
    backendCount,
    cartCount: isAuthenticated ? backendCount : guestCount,
    authVersion,
  };
}
