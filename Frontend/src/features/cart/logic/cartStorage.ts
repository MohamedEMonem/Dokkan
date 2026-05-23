import { ICartResponseItem } from "@/types/entities/cart.types";

export const saveGuestCart = (items: ICartResponseItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

export const loadGuestCart = (): ICartResponseItem[] => {
  const data = localStorage.getItem("cart");

  return data ? JSON.parse(data) : [];
};

export const clearGuestCart = () => {
  localStorage.removeItem("cart");
};
