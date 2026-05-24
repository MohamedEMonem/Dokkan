import { apiSlice } from "@/store/apiSlice";
import type { IAPIResponse, IPaginatedMeta } from "@/types/api/response.types";
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

type OrderListData = {
  orders: IOrder[];
  meta: IPaginatedMeta;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

type CreateOrderData = {
  orders: IOrder[];
};

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<
      IAPIResponse<CreateOrderData>,
      CreateOrderRequest
    >({
      query: (data) => ({ url: "/orders", method: "POST", body: data }),
      invalidatesTags: ["Order"],
    }),

    getOrders: builder.query<IAPIResponse<OrderListData>, GetOrdersQuery>({
      query: (params = {}) => ({ url: "/orders", method: "GET", params }),
      providesTags: ["Order"],
    }),

    getMyOrders: builder.query<IAPIResponse<OrderListData>, GetOrdersQuery>({
      query: (params = {}) => ({ url: "/orders/me", method: "GET", params }),
      providesTags: ["Order"],
    }),

    getOrdersByStoreId: builder.query<
      IAPIResponse<OrderListData>,
      { storeId: string; query?: GetOrdersQuery }
    >({
      query: ({ storeId, query }) => ({
        url: `/orders/store/${storeId}`,
        method: "GET",
        params: query,
      }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<IAPIResponse<IOrder>, { id: string }>({
      query: ({ id }) => ({ url: `/orders/${id}`, method: "GET" }),
      providesTags: ["Order"],
    }),

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
