import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query';

const token : string | null = localStorage.getItem('token'); // TBF later;

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.SERVER_DEV_API_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }

  }),
  endpoints: () => ({}),
  tagTypes : [
    /** Add tags to API Endpoints */
  ]
});