import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logout } from '@/entities/session';

// ─── Base Query with JWT Injection ───────────────────────────────────
const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://campusconnect-backend-production-81cf.up.railway.app/',
  prepareHeaders: (headers, { getState }) => {
    // Prefer the token from Redux state; fall back to localStorage
    const token =
      (getState() as { auth: { token: string | null } }).auth.token ??
      localStorage.getItem('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

// ─── Wrapper: Auto-logout on 401 ────────────────────────────────────
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token is expired or invalid — clear local auth state
    api.dispatch(logout());
  }

  return result;
};

// ─── API Slice ───────────────────────────────────────────────────────
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  /**
   * Global tag types for cache invalidation.
   * Extend this array as new feature APIs are added.
   */
  tagTypes: ['PendingEvents', 'ApprovedEvents', 'User', 'Club', 'Room', 'Resource', 'Facility', 'Report', 'Log'],
  endpoints: () => ({}),
});
