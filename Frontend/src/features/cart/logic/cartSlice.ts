import { ICartResponseItem } from "@/types/entities/cart.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadGuestCart, saveGuestCart, clearGuestCart } from "./cartStorage";

const loadCart = (): ICartResponseItem[] => {
  return loadGuestCart();
};

interface CartState {
  items: ICartResponseItem[];
}

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartResponseItem>) => {
      const item = action.payload;

      const existing = state.items.find((x) => x.productId === item.productId);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }

      saveGuestCart(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((x) => x.productId !== action.payload);

      saveGuestCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];

      clearGuestCart();
    },

    setCart: (state, action: PayloadAction<ICartResponseItem[]>) => {
      state.items = action.payload;

      saveGuestCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
