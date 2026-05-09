import { useState } from 'react';
import {
  CalendarClock,
  MapPin,
  Users as UsersIcon,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  useGetPendingEventsQuery,
  useReviewEventMutation,
} from '@/entities/event';
import type { Event } from '@/entities/event';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ─── Status Badge Variant Map ────────────────────────────────────────
const statusVariant: Record<Event['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
};

// ─── Skeleton Loader ─────────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4 animate-pulse"
      >
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="ml-auto h-8 w-20 rounded bg-muted" />
      </div>
    ))}
  </div>
);

// ─── Review Dialog ───────────────────────────────────────────────────
interface ReviewDialogProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const ReviewDialog = ({ event, open, onClose }: ReviewDialogProps) => {
  const [reviewEvent, { isLoading }] = useReviewEventMutation();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!event) return null;

  const handleApprove = async () => {
    try {
      await reviewEvent({ event_id: event.id, status: 'approved' }).unwrap();
      onClose();
    } catch {
      // Error handling via RTK Query — 401 auto-logout is handled by baseQuery
    }
  };

  const handleReject = async () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    try {
      await reviewEvent({
        event_id: event.id,
        status: 'rejected',
        reason: rejectionReason || undefined,
      }).unwrap();
      setRejectionReason('');
      setShowRejectInput(false);
      onClose();
    } catch {
      // Error handled by baseQuery
    }
  };

  const handleClose = () => {
    setShowRejectInput(false);
    setRejectionReason('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>
            Review the event details below and approve or reject.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailItem icon={UsersIcon} label="Club" value={event.club} />
            <DetailItem icon={UsersIcon} label="Organizer" value={event.organizer} />
            <DetailItem icon={CalendarClock} label="Date" value={event.date} />
            <DetailItem icon={Clock} label="Time" value={event.time} />
            <DetailItem icon={MapPin} label="Location" value={event.location} />
            {event.attendees !== undefined && (
              <DetailItem
                icon={UsersIcon}
                label="Expected"
                value={`${event.attendees} attendees`}
              />
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={statusVariant[event.status]} className="capitalize">
              {event.status}
            </Badge>
          </div>

          {/* Reject reason input */}
          {showRejectInput && (
            <div className="space-y-2 animate-fade-in">
              <label
                htmlFor="rejection-reason"
                className="text-sm font-medium"
              >
                Rejection Reason (optional)
              </label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this event is being rejected..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-none"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {showRejectInput ? 'Confirm Reject' : 'Reject'}
          </Button>
          {!showRejectInput && (
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Approve
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Detail Item Helper ──────────────────────────────────────────────
const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2.5">
    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  </div>
);

// ─── Events Queue Page ───────────────────────────────────────────────
export const EventsQueuePage = () => {
  const { data: events, isLoading, isError, refetch } = useGetPendingEventsQuery();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReview = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events Queue</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review and manage pending event submissions from clubs.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* ── Loading State ────────────────────────────── */}
      {isLoading && <TableSkeleton />}

      {/* ── Error State ──────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <h3 className="text-lg font-semibold">Failed to load events</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            There was an error fetching the events queue. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Data Table ───────────────────────────────── */}
      {!isLoading && !isError && events && (
        <>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-card p-16 text-center">
              <CalendarClock className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No pending events</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All event submissions have been reviewed. Check back later!
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Club
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {event.title}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {event.organizer}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm">{event.club}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-sm">{event.date}</span>
                            <span className="text-xs text-muted-foreground">
                              {event.time}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={statusVariant[event.status]}
                            className="capitalize"
                          >
                            {event.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReview(event)}
                            className="gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer with count */}
              <div className="border-t border-border/50 bg-muted/20 px-4 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Showing{' '}
                  <span className="font-medium text-foreground">
                    {events.length}
                  </span>{' '}
                  event{events.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Review Dialog ────────────────────────────── */}
      <ReviewDialog
        event={selectedEvent}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};
