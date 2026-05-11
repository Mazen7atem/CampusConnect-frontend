import { baseApi } from '@/shared/api';

// ─── Types ───────────────────────────────────────────────────────────

/** Shape returned by GET /api/events (approved events) */
export interface ApprovedEvent {
  event_id: number;
  type: 'event' | 'session';
  club_name: string;
  club_logo_url: string;
  club_cover_url: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  /** Note: backend has a typo — "regestrations" */
  regestrations: number;
  max_regestrations: number;
  status?: string;
  is_registered?: boolean;
}

/** Shape returned by GET /api/admin/approvals/events (pending events) */
export interface PendingEvent {
  event_id: number;
  type: 'event' | 'session';
  club_name: string;
  club_logo_url: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  max_registerations: number;
}

/** Payload for PATCH /api/admin/approvals/events/:id */
export interface ReviewEventPayload {
  event_id: number;
  status: 'approved' | 'rejected';
  /** Required when status === 'approved' */
  room_id?: string;
}

// ─── Injected Endpoints ──────────────────────────────────────────────
const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/events — all approved/scheduled events */
    getApprovedEvents: builder.query<ApprovedEvent[], void>({
      query: () => 'api/events',
      providesTags: ['ApprovedEvents'],
    }),

    /** GET /api/admin/approvals/events — events pending admin review */
    getPendingEvents: builder.query<PendingEvent[], void>({
      query: () => 'api/admin/approvals/events',
      providesTags: ['PendingEvents'],
    }),

    /** PATCH /api/admin/approvals/events/:id — approve or reject */
    reviewEvent: builder.mutation<void, ReviewEventPayload>({
      query: ({ event_id, ...body }) => ({
        url: `api/admin/approvals/events/${event_id}`,
        method: 'PATCH',
        body,
      }),
      // Invalidate pending list so the reviewed event disappears;
      // also refresh approved list if an event was just approved.
      invalidatesTags: ['PendingEvents', 'ApprovedEvents'],
    }),
  }),
});

export const {
  useGetApprovedEventsQuery,
  useGetPendingEventsQuery,
  useReviewEventMutation,
} = eventApi;
