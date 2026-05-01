import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { ICategory } from "@/types/entities/category.types";

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
