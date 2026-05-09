import { baseApi } from '@/shared/api';
import type { User } from '@/entities/session';

// ─── Types ───────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ─── Injected Endpoints ──────────────────────────────────────────────
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Authenticate an admin user.
     * POST /api/auth/login
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
