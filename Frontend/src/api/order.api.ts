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
import {
  IAPIResponse,
  IPaginatedResponse,
} from "@/types/api/response.types";
import {
  createOrderRequest,
  EOrderStatus,
  GetOrdersQueryParams,
  IOrder,
  orderSortByValues,
  orderSortDirValues,
} from "@/types/entities/order.types";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders (admin)
    getOrders: builder.query<
      IPaginatedResponse<IOrder, "orders">,
      GetOrdersQueryParams
    >({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          status: (params as { status?: typeof EOrderStatus } | undefined)
            ?.status,
          sortBy: (params as { sortBy?: typeof orderSortByValues } | undefined)
            ?.sortBy,
          sortDir: (
            params as { sortDir?: typeof orderSortDirValues } | undefined
          )?.sortDir,
        },
      }),
      providesTags: ["Order"],
    }),

    // Update order status (store owner)
    updateOrderStatus: builder.mutation<
      IAPIResponse<{ order: Partial<IOrder> }>,
      { id: string; status: typeof EOrderStatus }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    // Get order by id (customer or admin)
    getOrderById: builder.query<
      IAPIResponse<{ order: Partial<IOrder> }>,
      string
    >({
      query: (id) => ({ url: `/orders/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Order", id } as const],
    }),

    //Get my orders (customer)
    getMyOrders: builder.query<
      IPaginatedResponse<IOrder, "orders">,
      GetOrdersQueryParams
    >({
      query: (params) => ({
        url: "/orders/me",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          status: params?.status,
          sortBy: params?.sortBy,
          sortDir: params?.sortDir,
        },
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
    //Get orders for a store (store owner)
    getOrdersByStoreId: builder.query<
      IPaginatedResponse<IOrder, "orders">,
      GetOrdersQueryParams & { storeId: string }
    >({
      query: (params) => {
        return {
          url: `/orders/store/${params.storeId}`,
          method: "GET",
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
            status: params?.status,
            sortBy: params?.sortBy,
            sortDir: params?.sortDir,
          },
        };
      },
      providesTags: ["Order"],
    }),

    //Checkout - place a new order from cart (customer)
    createOrder: builder.mutation<
      IPaginatedResponse<IOrder, "orders">,
      { body: createOrderRequest }
    >({
      query: ({ body }) => ({
        url: "/orders",
        method: "POST",
        body: body,
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
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersByStoreIdQuery,
  useCreateOrderMutation,
} = orderApi;
