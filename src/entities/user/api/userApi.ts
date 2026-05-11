import { baseApi } from '@/shared/api';

// ─── Types ───────────────────────────────────────────────────────────
export interface Student {
  student_id: string;
  student_name: string;
  faculty: string;
  major: string;
  student_email: string;
  status: 'active' | 'banned';
  reservations: number;
  complaints: number;
}

/**
 * Strict payload for POST /api/admin/users.
 * Common fields are always sent; student-only fields are included
 * only when role === 'student'.
 */
export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_name: string;
  role: 'student' | 'admin';
  phone: string;
  /** Student-only fields — required when role === 'student' */
  faculty?: string;
  major?: string;
  level?: string;
  picture?: string;
  in_dorms?: boolean;
}

export interface CreateUserResponse {
  message: string;
  user_id: string;
}

// ─── Injected Endpoints ──────────────────────────────────────────────
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/users/students — provides ['User'] */
    getStudents: builder.query<Student[], void>({
      query: () => 'api/users/students',
      providesTags: ['User'],
    }),

    /** GET /api/users/?search={query} — provides ['User'] */
    searchStudents: builder.query<Student[], string>({
      query: (search) => `api/users/?search=${encodeURIComponent(search)}`,
      providesTags: ['User'],
    }),

    /** POST /admin/users — invalidates ['User'] */
    createUser: builder.mutation<CreateUserResponse, CreateUserPayload>({
      query: (body) => ({
        url: 'api/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    /** PATCH /api/users/:id/ban — invalidates ['User'] */
    banUser: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `api/users/${id}/ban`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),

    /** PATCH /api/users/:id/unban — invalidates ['User'] */
    unbanUser: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `api/users/${id}/unban`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useLazySearchStudentsQuery,
  useCreateUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} = userApi;
