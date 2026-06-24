import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse, IPaginatedResponse } from "@/types/api/response.types";
import { IUser } from "@/types/entities/user.types";
import { UpdateProfileDTO } from "@/types/dto/user.dto";

// ── Query Params for admin list ───────────────────────────────────────────── //
export interface AdminListUsersParams {
  page?: number;
  limit?: number;
  role?: "Customer" | "StoreOwner" | "Admin" | "";
  search?: string;
  sortBy?: "createdAt" | "name" | "email";
  sortDir?: "asc" | "desc";
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Customer / Profile endpoints ──────────────────────────────────────── //
    getProfile: builder.query<IAPIResponse<{ user: IUser }>, void>({
      query: () => "/user/profile",
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation<
      IAPIResponse<{ user: IUser }>,
      UpdateProfileDTO
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

    // ── Admin: User Management endpoints ─────────────────────────────────── //
    adminListUsers: builder.query<
      IPaginatedResponse<IUser, "users">,
      AdminListUsersParams | void
    >({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["User"],
    }),

    adminDeleteUser: builder.mutation<IAPIResponse<null>, { userId: string }>({
      query: ({ userId }) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
  useAdminListUsersQuery,
  useAdminDeleteUserMutation,
} = userApi;
