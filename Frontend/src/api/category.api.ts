import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";

export interface ICategory {
  id: string;
  name: string;
  parentCategoryId?: string | null;
}

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<IAPIResponse<ICategory[]>, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
