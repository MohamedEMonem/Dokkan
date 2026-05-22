import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse, IPaginatedResponse } from "@/types/api/response.types";
import { IProduct } from "@/types/entities/product.types";
import { CreateProductDTO, UpdateProductDTO } from "@/types/dto/product.dto";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      IPaginatedResponse<IProduct, "products">,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Product"],
    }),

    getProductById: builder.query<
      IAPIResponse<IProduct>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getProductsByStoreId: builder.query<
      IPaginatedResponse<IProduct, "products">,
      string
    >({
      query: (storeId) => ({
        url: `/products?storeId=${storeId}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<
      IAPIResponse<IProduct>,
      CreateProductDTO
    >({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<
      IAPIResponse<IProduct>,
      UpdateProductDTO
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<
      IAPIResponse<null>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByStoreIdQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;
