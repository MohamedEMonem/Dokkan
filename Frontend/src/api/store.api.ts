import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { IStore } from "@/types/entities/store.types";

export const storeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<IAPIResponse<IStore[]>, void>({
      query: () => ({
        url: "/stores",
        method: "GET",
      }),
      providesTags: ["Store"],
    }),
  }),
});

export const { useGetStoresQuery } = storeApi;
