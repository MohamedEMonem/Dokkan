import { apiSlice } from "@/store/apiSlice";
import type { IAPIResponse, IPaginatedResponse } from "@/types/api/response.types";
import { EOrderStatus, IOrder } from "@/types/entities/order.types";

export type OrderSortBy = "createdAt" | "status" | "totalAmount";
export type OrderSortDir = "asc" | "desc";

export interface CreateOrderRequest {
  username: string;
  phoneNumber: string;
  email: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    country: string;
    postalCode?: string;
  };
}

export interface GetOrdersQuery {
  page?: number;
  limit?: number;
  status?: EOrderStatus;
  sortBy?: OrderSortBy;
  sortDir?: OrderSortDir;
}

export interface UpdateOrderStatusRequest {
  id: string;
  status: EOrderStatus;
}

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Checkout - place a new order from cart (customer)
    createOrder: builder.mutation<
      IAPIResponse<{ orders: IOrder[] }>,
      CreateOrderRequest
    >({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    // Get all orders (admin)
    getOrders: builder.query<
      IPaginatedResponse<IOrder, "orders">,
      GetOrdersQuery
    >({
      query: (params = {}) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // Get my orders (customer)
    getMyOrders: builder.query<
      IPaginatedResponse<IOrder, "orders">,
      GetOrdersQuery
    >({
      query: (params = {}) => ({
        url: "/orders/me",
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // Get orders for a store (store owner)
    getOrdersByStoreId: builder.query<
      IPaginatedResponse<IOrder, "orders">,
      GetOrdersQuery & { storeId: string }
    >({
      query: ({ storeId, ...params }) => ({
        url: `/orders/store/${storeId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // Get order by id (customer or admin)
    getOrderById: builder.query<
      IAPIResponse<{ order: IOrder }>,
      string
    >({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Order", id } as const],
    }),

    // Update order status (store owner)
    updateOrderStatus: builder.mutation<
      IAPIResponse<{ order: IOrder }>,
      UpdateOrderStatusRequest
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrdersByStoreIdQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
