import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_DEV_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include'
  }),
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "Category",
    "Product",
    "Store",
    "Plan",
    "Order",
    "User",
  ],
});
