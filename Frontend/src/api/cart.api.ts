import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { ICartRequest, ICartResponse } from "@/types/entities/cart.types";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<IAPIResponse<ICartResponse>, void>({
      query: () => ({ url: "/cart", method: "GET" }),
      providesTags: ["Cart"],
    }),

    addItem: builder.mutation<IAPIResponse<ICartResponse>, ICartRequest>({
      query: ({ productId, quantity = 1 }) => ({
        url: "/cart/items",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateItem: builder.mutation<IAPIResponse<ICartResponse>, ICartRequest>({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeItem: builder.mutation<
      IAPIResponse<ICartResponse>,
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<IAPIResponse<ICartResponse>, void>({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApi;
