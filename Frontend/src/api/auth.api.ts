import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { IUser, IUserInfo } from "@/types/entities/user.types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      IAPIResponse<{ token: string; user: IUser }>, 
      Pick<IUser, "name" | "email" | "password" | "role">
    > ({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<
      IAPIResponse<{ token: string; user: IUser }>,
      Pick<IUserInfo, "email" & "password">
    > ({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
