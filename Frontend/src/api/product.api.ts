import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { IProduct } from "@/types/entities/product.types";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IAPIResponse<IProduct[]>, void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
    }),

    getProductById: builder.query<IAPIResponse<IProduct>, { id: string }>({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
    }),

    getProductsByStoreId: builder.query<IAPIResponse<IProduct[]>, string>({
      query: (storeId) => ({
        url: `/products?storeId=${storeId}`,
        method: "GET",
      }),
    }),

    createProduct: builder.mutation<IAPIResponse<IProduct>, Partial<IProduct>>({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
    }),

    deleteProduct: builder.mutation<IAPIResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),

    updateProduct: builder.mutation<
      IAPIResponse<IProduct>,
      { id: string; data: Partial<IProduct> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;
