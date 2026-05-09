import { baseApi } from '@/shared/api';

// ─── Types ───────────────────────────────────────────────────────────
export interface Club {
  id: number;
  name: string;
  description: string;
  email: string;
  logo: string;
  cover: string;
  followers_count: number;
  members?: number;
  event_number: number;
  sessions_number?: number;
  posts_number?: number;
  club_admin_name: string;
  status?: string;
  is_joined: boolean;
}

export interface CreateClubPayload {
  name: string;
  description: string;
  email: string;
  /** Array of student IDs to be assigned as club managers */
  std_ids: (number | { id: number; role_title: string })[];
}

export interface UpdateClubPayload {
  name?: string;
  description?: string;
  logo?: string;
  cover?: string;
}

// ─── Injected Endpoints ──────────────────────────────────────────────
const clubApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/clubs */
    getClubs: builder.query<Club[], void>({
      query: () => 'api/clubs',
      providesTags: ['Club'],
    }),

    /** GET /api/clubs/:id */
    getClubDetails: builder.query<Club, number>({
      query: (id) => `api/clubs/${id}`,
      providesTags: ['Club'],
    }),

    /** POST /api/clubs */
    createClub: builder.mutation<Club, CreateClubPayload>({
      query: (body) => ({
        url: 'api/clubs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Club'],
    }),

    /** PUT /api/clubs/:id */
    updateClub: builder.mutation<Club, { id: number; body: UpdateClubPayload }>({
      query: ({ id, body }) => ({
        url: `api/clubs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Club'],
    }),
  }),
});

export const {
  useGetClubsQuery,
  useGetClubDetailsQuery,
  useLazyGetClubDetailsQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
} = clubApi;
