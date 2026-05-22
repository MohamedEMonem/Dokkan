import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { IUser } from "@/types/entities/user.types";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<IAPIResponse<{ user: IUser }>, void>({
      query: () => "/user/profile",
      providesTags: ["Auth"],
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
