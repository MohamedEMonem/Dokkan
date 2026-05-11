import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { IStore } from "@/types/entities/store.types";

export const storeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStore: builder.query<IAPIResponse<{ store: IStore }>, void>({
      query: () => ({
        url: "/stores/store",
        method: "GET",
      }),
      providesTags: ["Store"] as any,
    }),
  }),
});

export const { useGetStoreQuery } = storeApi;
