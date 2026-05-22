import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { IUser } from "@/types/entities/user.types";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<IAPIResponse<{ user: IUser }>, void>({
      query: () => "/user/profile",
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation<
      IAPIResponse<{ user: IUser }>,
      FormData | { name?: string; contactNumber?: string | null }
    >({
      query: (body) => ({
        url: "/user/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    deleteAccount: builder.mutation<IAPIResponse<null>, void>({
      query: () => ({
        url: "/user/profile",
        method: "DELETE",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} = userApi;
