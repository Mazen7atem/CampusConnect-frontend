import { baseApi } from '@/shared/api';

// ─── Types ───────────────────────────────────────────────────────────
export interface Event {
  id: string;
  title: string;
  description: string;
  club: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  organizer: string;
  attendees?: number;
  image?: string;
}

export interface ReviewEventPayload {
  event_id: string;
  status: 'approved' | 'rejected';
  reason?: string;
}

// ─── Injected Endpoints ──────────────────────────────────────────────
const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetch all pending events for the review queue.
     */
    getPendingEvents: builder.query<Event[], void>({
      query: () => '/events',
      providesTags: ['PendingEvents'],
    }),

    /**
     * Approve or reject a specific event.
     */
    reviewEvent: builder.mutation<void, ReviewEventPayload>({
      query: ({ event_id, ...body }) => ({
        url: `/events/${event_id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['PendingEvents'],
    }),
  }),
});

export const { useGetPendingEventsQuery, useReviewEventMutation } = eventApi;
