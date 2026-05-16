import { useState } from 'react';
import {
  CalendarClock,
  MapPin,
  Users as UsersIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  DoorOpen,
  CalendarCheck,
  CalendarX,
  Building2,
} from 'lucide-react';
import {
  useGetApprovedEventsQuery,
  useGetPendingEventsQuery,
  useReviewEventMutation,
} from '@/entities/event';
import type { PendingEvent, ApprovedEvent } from '@/entities/event';
import { useGetRoomsQuery } from '@/entities/room';
import type { Room } from '@/entities/room';
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

// ─── Skeleton Loader ─────────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 rounded-lg border border-outline-variant bg-card p-4 animate-pulse"
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

// ─── Review Dialog (Pending → Approve or Reject) ──────────────────────
interface ReviewDialogProps {
  event: PendingEvent | null;
  open: boolean;
  onClose: () => void;
}

const ReviewDialog = ({ event, open, onClose }: ReviewDialogProps) => {
  const [reviewEvent, { isLoading }] = useReviewEventMutation();
  const { data: rooms = [], isLoading: roomsLoading } = useGetRoomsQuery();

  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [confirmReject, setConfirmReject] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!event) return null;

  const handleClose = () => {
    setSelectedRoomId('');
    setConfirmReject(false);
    setError(null);
    onClose();
  };

  const handleApprove = async () => {
    if (!selectedRoomId) {
      setError('Please select a room before approving.');
      return;
    }
    setError(null);
    try {
      await reviewEvent({
        event_id: event.event_id,
        status: 'approved',
        room_id: selectedRoomId,
      }).unwrap();
      handleClose();
    } catch {
      setError('Failed to approve the event. Please try again.');
    }
  };

  const handleReject = async () => {
    if (!confirmReject) {
      setConfirmReject(true);
      return;
    }
    setError(null);
    try {
      await reviewEvent({
        event_id: event.event_id,
        status: 'rejected',
      }).unwrap();
      handleClose();
    } catch {
      setError('Failed to reject the event. Please try again.');
    }
  };

  const formatDT = (s: string) => {
    try {
      return new Date(s).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return s;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="capitalize text-xs">
              {event.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {event.club_name}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Time & Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <DetailItem
              icon={Clock}
              label="Start"
              value={formatDT(event.start_time)}
            />
            <DetailItem
              icon={Clock}
              label="End"
              value={formatDT(event.end_time)}
            />
            <DetailItem
              icon={UsersIcon}
              label="Max Registrations"
              value={String(event.max_registerations)}
            />
          </div>

          {/* Room Selector — shown always, required for approval */}
          <div className="space-y-1.5">
            <label
              htmlFor="room-select"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
              Assign Room
              <span className="text-xs text-muted-foreground font-normal">
                (required to approve)
              </span>
            </label>
            {roomsLoading ? (
              <div className="h-9 rounded-md bg-muted animate-pulse" />
            ) : (
              <select
                id="room-select"
                value={selectedRoomId}
                onChange={(e) => {
                  setSelectedRoomId(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">— Select a room —</option>
                {rooms.map((room: Room) => (
                  <option key={room.id} value={String(room.id)}>
                    Room {room.room_number} — {room.building_name}
                    {room.capacity ? ` (cap. ${room.capacity})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Rejection confirmation notice */}
          {confirmReject && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              Click <strong>Confirm Reject</strong> again to permanently reject
              this event. This cannot be undone.
            </div>
          )}

          {/* Inline error */}
          {error && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && !selectedRoomId ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {confirmReject ? 'Confirm Reject' : 'Reject'}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading || !selectedRoomId}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading && !!selectedRoomId ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Approve
          </Button>
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

// ─── Pending Events Tab ───────────────────────────────────────────────
const PendingTab = () => {
  const { data: events, isLoading, isError, refetch } = useGetPendingEventsQuery();
  const [selected, setSelected] = useState<PendingEvent | null>(null);

  const formatDT = (s: string) => {
    try {
      return new Date(s).toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return s;
    }
  };

  if (isLoading) return <TableSkeleton />;

  if (isError)
    return (
      <ErrorState onRetry={refetch} message="Could not fetch pending events." />
    );

  if (!events || events.length === 0)
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No pending events"
        description="All event submissions have been reviewed. Check back later!"
      />
    );

  return (
    <>
      <div className="rounded-lg border border-outline-variant bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-surface-container-low">
                {['Title', 'Club', 'Type', 'Start Time', 'Max Reg.', 'Action'].map(
                  (col, i) => (
                    <th
                      key={col}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${i === 5 ? 'text-right' : 'text-left'
                        }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {events.map((event) => (
                <tr
                  key={event.event_id}
                  className="transition-colors hover:bg-surface-container-low"
                >
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium">{event.title}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm">{event.club_name}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="outline" className="capitalize text-xs">
                      {event.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {formatDT(event.start_time)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm">
                      <UsersIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {event.max_registerations}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button
                      size="sm"
                      onClick={() => setSelected(event)}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-outline-variant bg-surface-container-low px-4 py-2.5">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{events.length}</span>{' '}
            pending event{events.length !== 1 ? 's' : ''} awaiting review
          </p>
        </div>
      </div>

      <ReviewDialog
        event={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

// ─── Approved Events Tab ─────────────────────────────────────────────
const ApprovedTab = () => {
  const { data: events, isLoading, isError, refetch } = useGetApprovedEventsQuery();

  const formatDT = (s: string) => {
    try {
      return new Date(s).toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return s;
    }
  };

  if (isLoading) return <TableSkeleton />;

  if (isError)
    return (
      <ErrorState onRetry={refetch} message="Could not fetch approved events." />
    );

  if (!events || events.length === 0)
    return (
      <EmptyState
        icon={CalendarX}
        title="No approved events"
        description="No events have been approved yet."
      />
    );

  return (
    <div className="rounded-lg border border-outline-variant bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-surface-container-low">
              {['Title', 'Club', 'Type', 'Start Time', 'Location', 'Registrations'].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {events.map((event) => (
              <tr
                key={event.event_id}
                className="transition-colors hover:bg-surface-container-low"
              >
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{event.title}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-xs">
                      {event.description}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {event.club_logo_url && (
                      <img
                        src={event.club_logo_url}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover bg-muted"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).style.display = 'none')
                        }
                      />
                    )}
                    <span className="text-sm">{event.club_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant="outline" className="capitalize text-xs">
                    {event.type}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {formatDT(event.start_time)}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {event.location || '—'}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm">
                    <UsersIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {event.regestrations ?? 0} / {event.max_regestrations}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-outline-variant bg-surface-container-low px-4 py-2.5">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{events.length}</span>{' '}
          approved event{events.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

// ─── Shared Error / Empty States ──────────────────────────────────────
const ErrorState = ({
  onRetry,
  message,
}: {
  onRetry: () => void;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
    <AlertCircle className="h-10 w-10 text-destructive mb-3" />
    <h3 className="text-lg font-semibold">Failed to load</h3>
    <p className="text-sm text-muted-foreground mt-1 mb-4">{message}</p>
    <Button variant="outline" onClick={onRetry} className="gap-2">
      <RefreshCw className="h-4 w-4" />
      Retry
    </Button>
  </div>
);

const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-card p-16 text-center">
    <Icon className="h-12 w-12 text-muted-foreground/40 mb-4" />
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
  </div>
);

// ─── Tab type ────────────────────────────────────────────────────────
type Tab = 'pending' | 'approved';

// ─── Events Queue Page ───────────────────────────────────────────────
export const EventsQueuePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('pending');

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-primary" />
          Events Queue
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review pending event submissions and browse all approved events.
        </p>
      </div>

      {/* ── Tabs ─────────────────────────────────────── */}
      <div className="flex items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-1 w-fit">
        {(
          [
            { id: 'pending' as Tab, label: 'Pending Review', icon: Building2 },
            { id: 'approved' as Tab, label: 'Approved Events', icon: CalendarCheck },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === id
                ? 'bg-primary text-primary-foreground shadow-level-1'
                : 'text-on-surface-variant hover:text-foreground hover:bg-surface-container'
              }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ──────────────────────────────── */}
      {activeTab === 'pending' && <PendingTab />}
      {activeTab === 'approved' && <ApprovedTab />}
    </div>
  );
};
