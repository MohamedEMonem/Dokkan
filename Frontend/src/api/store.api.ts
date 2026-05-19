import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse, IPaginatedResponse } from "@/types/api/response.types";
import { IStore } from "@/types/entities/store.types";
import { IUser } from "@/types/entities/user.types";
import { CreateStoreDTO, UpdateStoreDTO } from "@/types/dto/store.dto";

export const storeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
      { page?: number; limit?: number } | void
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
  }),
});

export const {
  useGetUserStoreQuery,
  useListStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApi;
