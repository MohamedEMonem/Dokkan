import type { AppDispatch } from "@/store/store";
import { addToCart } from "./cartSlice";
import { saveGuestCart } from "./cartStorage";
import { ICartResponseItem } from "@/types/entities/cart.types";

type MinimalCartState = { cart?: { items?: ICartResponseItem[] } };

export type AddItemParams = {
  item: ICartResponseItem;
  isAuthenticated: boolean;
  dispatch: AppDispatch;
  addToCartApi?: (payload: {
    productId: string;
    quantity: number;
  }) => Promise<unknown>;
  getState: () => MinimalCartState;
};

export type MergeGuestCartParams = {
  items: ICartResponseItem[];
  addToCartApi: (payload: {
    productId: string;
    quantity: number;
  }) => Promise<unknown>;
};

export const addItemToCart = async ({
  item,
  isAuthenticated,
  dispatch,
  addToCartApi,
  getState,
}: AddItemParams) => {
  if (isAuthenticated) {
    // backend cart: expect `addToCartApi` to be an RTK mutation trigger
    if (!addToCartApi)
      throw new Error("addToCartApi is required for authenticated users");
    // await the trigger; callers can use unwrap if they need the payload.
    await addToCartApi({ productId: item.productId, quantity: item.quantity });
  } else {
    // guest cart - update local slice and persist
    dispatch(addToCart(item));

    const items = getState().cart?.items ?? [];

    saveGuestCart(items as ICartResponseItem[]);
  }
};

export const mergeGuestCartIntoBackend = async ({
  items,
  addToCartApi,
}: MergeGuestCartParams) => {
  if (!items.length) return;

  for (const item of items) {
    await addToCartApi({
      productId: item.productId,
      quantity: item.quantity,
    });
  }
};
