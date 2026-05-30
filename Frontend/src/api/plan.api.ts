import { apiSlice } from "@/store/apiSlice";
import { IAPIResponse } from "@/types/api/response.types";
import { GetOwnerStorePlanDTO } from "@/types/dto/plan.dto";
import { IPlan } from "@/types/entities/subscription.types";

export const planApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<IAPIResponse<{ plans: IPlan[] }>, void>({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
      providesTags: ["Plan"],
    }),

    getPlanById: builder.query<
      IAPIResponse<{ plan: IPlan }>,
      { identifier: string }
    >({
      query: ({ identifier }) => ({
        url: `/plans/${identifier}`,
        method: "GET",
      }),
      providesTags: ["Plan"],
    }),

    getOwnerStorePlan: builder.query<IAPIResponse<GetOwnerStorePlanDTO>, void>({
      query: () => ({
        url: "/plans/me",
        method: "GET",
      }),
      providesTags: ["Plan"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useGetOwnerStorePlanQuery,
} = planApi;
