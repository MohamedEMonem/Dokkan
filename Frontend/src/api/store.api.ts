import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse, IPaginatedResponse } from "@/types/api/response.types";
import {
  IStore,
  EStoreStatus,
  IStoreAnalyticsParams,
  IStoreAnalyticsResponse,
} from "@/types/entities/store.types";
import { IUser } from "@/types/entities/user.types";
import { CreateStoreDTO, UpdateStoreDTO } from "@/types/dto/store.dto";

export interface AdminListStoresParams {
  page?: number;
  limit?: number;
  status?: EStoreStatus | "";
  search?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

export const storeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get store analytics (revenue, salesOverTime, topProducts)
    getStoreAnalytics: builder.query<
      IAPIResponse<IStoreAnalyticsResponse>,
      IStoreAnalyticsParams | void
    >({
      query: (params) => ({
        url: "/stores/analytics",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Store", "Order"],
    }),

    // Get details for the authenticated user's store
    getUserStore: builder.query<
      IAPIResponse<{ store: IStore }>,
      void
    >({
      query: () => ({
        url: "/stores/me",
        method: "GET",
      }),
      providesTags: ["Store"],
    }),

    // Browse active stores with pagination
    listStores: builder.query<
      IPaginatedResponse<Partial<IStore>, "stores">,
      { page?: number; limit?: number; subdomain?: string } | void
    >({
      query: (params) => ({
        url: "/stores",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Store"],
    }),

    // Create a new store for the authenticated user
    createStore: builder.mutation<
      IAPIResponse<{ newStore: { store: IStore; storeowner: IUser } }>,
      CreateStoreDTO
    >({
      query: (storeData) => ({
        url: "/stores",
        method: "POST",
        body: storeData,
      }),
      invalidatesTags: ["Store"],
    }),

    // Update the authenticated user's store
    updateStore: builder.mutation<
      IAPIResponse<{ updatedStore: IStore }>,
      UpdateStoreDTO
    >({
      query: (storeData) => ({
        url: "/stores/me",
        method: "PUT",
        body: storeData,
      }),
      invalidatesTags: ["Store"],
    }),

    // Soft-delete the authenticated user's store
    deleteStore: builder.mutation<
      IAPIResponse<{ deletedStore: IStore }>,
      void
    >({
      query: () => ({
        url: "/stores/me",
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    // Admin: List all stores with filters (uses public endpoint)
    adminListStores: builder.query<
      IPaginatedResponse<IStore, "stores">,
      AdminListStoresParams | void
    >({
      query: (params) => ({
        url: "/stores",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Store"],
    }),

    // Admin: Suspend/Remove store
    adminSuspendStore: builder.mutation<
      IAPIResponse<{ store: IStore }>,
      { storeId: string }
    >({
      query: ({ storeId }) => ({
        url: `/admin/stores/${storeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    // Admin: Restore/Activate store (for suspended/deleted stores)
    adminRestoreStore: builder.mutation<
      IAPIResponse<IStore>,
      { storeId: string }
    >({
      query: ({ storeId }) => ({
        url: `/admin/restore/store/${storeId}`,
        method: "POST",
      }),
      invalidatesTags: ["Store"],
    }),

    // Admin: Update store status (for pending stores approval)
    adminUpdateStoreStatus: builder.mutation<
      IAPIResponse<{ store: IStore }>,
      { storeId: string; status: EStoreStatus }
    >({
      query: ({ storeId, status }) => ({
        url: `/admin/stores/${storeId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Store"],
    }),
  }),
});

export const {
  useGetStoreAnalyticsQuery,
  useGetUserStoreQuery,
  useListStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useAdminListStoresQuery,
  useAdminSuspendStoreMutation,
  useAdminRestoreStoreMutation,
  useAdminUpdateStoreStatusMutation,
} = storeApi;
