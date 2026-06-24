import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_DEV_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include'
});

// Mutex-like logic using a promise queue
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        // Attempt to refresh the token
        const refreshResult = await baseQuery(
          { url: '/auth/refresh', method: 'POST' },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Success! Update local storage
          const responseData = refreshResult.data as { data: { token: string } };
          const newToken = responseData.data?.token;
          
          if (newToken) {
            localStorage.setItem('token', newToken);
            onRefreshed(newToken);
            // Retry the original query
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Unexpected response format
            throw new Error("Invalid token format from refresh endpoint");
          }
        } else {
          // Refresh failed (e.g., refresh token expired)
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
        refreshSubscribers = []; // Clear subscribers on error to prevent memory leaks
      }
    } else {
      // If a refresh is already in progress, wait for it to finish
      await new Promise<string>((resolve) => {
        subscribeTokenRefresh(resolve);
      });
      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes : [
    "Auth",
    "Category",
    "Product",
    "Store",
    "Plan"
  ]
});