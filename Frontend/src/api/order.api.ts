import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { IOrder } from "@/types/entities/order.types";
import type { Address } from "@/features/checkout/CheckoutForm";

interface CreateOrderRequest {
  shippingAddress: Address;
  paymentMethod?: string;
}

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<IAPIResponse<IOrder>, CreateOrderRequest>({
      query: (data) => ({ url: "/orders", method: "POST", body: data }),
      invalidatesTags: ["Cart"],
    }),

    getOrderById: builder.query<IAPIResponse<IOrder>, { id: string }>({
      query: ({ id }) => ({ url: `/orders/${id}`, method: "GET" }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderByIdQuery } = orderApi;
