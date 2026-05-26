import { apiSlice } from "@/store/apiSlice";
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
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersByStoreIdQuery,
  useCreateOrderMutation,
} = orderApi;
