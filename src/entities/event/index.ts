export {
  useGetApprovedEventsQuery,
  useGetPendingEventsQuery,
  useReviewEventMutation,
} from './api/eventApi';

export type {
  ApprovedEvent,
  PendingEvent,
  ReviewEventPayload,
} from './api/eventApi';
