import { useState, type FormEvent } from 'react';
import {
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  DoorOpen,
  Package,
} from 'lucide-react';
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useGetResourcesQuery,
  useCreateResourceMutation,
  useUpdateRoomMutation,
} from '@/entities/room';
import type { CreateRoomPayload, CreateResourcePayload } from '@/entities/room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// ─── Table Skeleton ──────────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="ml-auto h-8 w-16 rounded bg-muted" />
      </div>
    ))}
  </div>
);

// ─── Room Management Page ────────────────────────────────────────────
export const RoomManagementPage = () => {
  const { data: rooms, isLoading, isError, refetch } = useGetRoomsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const [createRoom, { isLoading: isCreatingRoom }] = useCreateRoomMutation();
  const [createResource, { isLoading: isCreatingResource }] = useCreateResourceMutation();
  const [updateRoom] = useUpdateRoomMutation();

  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Create room dialog
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomForm, setRoomForm] = useState<CreateRoomPayload>({
    room_number: 0,
    building_name: '',
    capacity: 0,
    type: '',
    start_time: 8,
    end_time: 18,
    resources_ids: [],
  });

  // Create resource dialog
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [resourceForm, setResourceForm] = useState<CreateResourcePayload>({
    name: '',
  });

  // ── Toggle availability ────────────────────────────────────────────
  const handleToggleAvailability = async (id: number, current: boolean) => {
    setTogglingId(id);
    try {
      await updateRoom({ id, is_available: !current }).unwrap();
      toast.success(`Room marked as ${!current ? 'available' : 'unavailable'}`);
    } catch {
      toast.error('Failed to update room availability');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Toggle resource selection ──────────────────────────────────────
  const toggleResource = (id: number) => {
    setRoomForm((prev) => ({
      ...prev,
      resources_ids: prev.resources_ids.includes(id)
        ? prev.resources_ids.filter((r) => r !== id)
        : [...prev.resources_ids, id],
    }));
  };

  // ── Create Room Handler ────────────────────────────────────────────
  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createRoom(roomForm).unwrap();
      toast.success('Room created successfully');
      setRoomDialogOpen(false);
      setRoomForm({
        room_number: 0,
        building_name: '',
        capacity: 0,
        type: '',
        start_time: 8,
        end_time: 18,
        resources_ids: [],
      });
    } catch {
      toast.error('Failed to create room');
    }
  };

  // ── Create Resource Handler ────────────────────────────────────────
  const handleCreateResource = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createResource(resourceForm).unwrap();
      toast.success('Resource created successfully');
      setResourceDialogOpen(false);
      setResourceForm({ name: '' });
    } catch {
      toast.error('Failed to create resource');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Room Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View rooms and manage room resources.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setResourceDialogOpen(true)} className="gap-2">
            <Package className="h-4 w-4" />
            Add Resource
          </Button>
          <Button size="sm" onClick={() => setRoomDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Room
          </Button>
        </div>
      </div>

      {/* ── Loading ────────────────────────────────────── */}
      {isLoading && <TableSkeleton />}

      {/* ── Error ──────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <h3 className="text-lg font-semibold">Failed to load rooms</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Could not fetch room records. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Data Table ─────────────────────────────────── */}
      {!isLoading && !isError && rooms && (
        <>
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-card p-16 text-center">
              <DoorOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No rooms found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No rooms have been created yet.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Room #</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Building</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capacity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hours</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resources</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {rooms.map((room) => (
                      <tr key={room.id} className="transition-colors hover:bg-muted/20">
                        <td className="px-4 py-3.5 text-sm font-medium">{room.room_number}</td>
                        <td className="px-4 py-3.5 text-sm">{room.building_name}</td>
                        <td className="px-4 py-3.5 text-sm">{room.type}</td>
                        <td className="px-4 py-3.5 text-sm">{room.capacity}</td>
                        <td className="px-4 py-3.5 text-sm">{room.start_time}:00 – {room.end_time}:00</td>
                        <td className="px-4 py-3.5">
                          <Badge variant={room.status === 'available' ? 'default' : 'secondary'} className="capitalize">
                            {room.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {room.resources.length > 0 ? (
                              room.resources.map((r, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{r}</Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                           <Button
                             variant={room.status === 'available' ? 'outline' : 'secondary'}
                             size="sm"
                             disabled={togglingId === room.id}
                             onClick={() => handleToggleAvailability(room.id, room.status === 'available')}
                             className="gap-1.5 text-xs"
                           >
                             {togglingId === room.id ? (
                               <Loader2 className="h-3.5 w-3.5 animate-spin" />
                             ) : null}
                             {room.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                           </Button>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border/50 bg-muted/20 px-4 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{rooms.length}</span> room{rooms.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Create Room Dialog ─────────────────────────── */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateRoom} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input id="room_number" type="number" value={roomForm.room_number || ''} onChange={(e) => setRoomForm((p) => ({ ...p, room_number: Number(e.target.value) }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_name">Building Name</Label>
                <Input id="building_name" value={roomForm.building_name} onChange={(e) => setRoomForm((p) => ({ ...p, building_name: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_type">Type</Label>
                <select
                  id="room_type"
                  value={roomForm.type}
                  onChange={(e) => setRoomForm((p) => ({ ...p, type: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="" disabled>Select type…</option>
                  <option value="public study room">Public Study Room</option>
                  <option value="private study room">Private Study Room</option>
                  <option value="meeting room">Meeting Room</option>
                  <option value="theatre">Theatre</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" value={roomForm.capacity || ''} onChange={(e) => setRoomForm((p) => ({ ...p, capacity: Number(e.target.value) }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Hour</Label>
                <Input id="start_time" type="number" min={0} max={23} value={roomForm.start_time} onChange={(e) => setRoomForm((p) => ({ ...p, start_time: Number(e.target.value) }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Hour</Label>
                <Input id="end_time" type="number" min={0} max={23} value={roomForm.end_time} onChange={(e) => setRoomForm((p) => ({ ...p, end_time: Number(e.target.value) }))} required />
              </div>
            </div>

            {/* Resource selector */}
            <div className="space-y-2">
              <Label>Resources</Label>
              {resources.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No resources available.{' '}
                  <button
                    type="button"
                    onClick={() => { setRoomDialogOpen(false); setResourceDialogOpen(true); }}
                    className="text-primary underline"
                  >
                    Create one first
                  </button>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {resources.map((resource) => {
                    const isSelected = roomForm.resources_ids.includes(resource.resource_id);
                    return (
                      <button
                        key={resource.resource_id}
                        type="button"
                        onClick={() => toggleResource(resource.resource_id)}
                        className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-foreground border-input hover:bg-muted'
                        }`}
                      >
                        {resource.name}
                      </button>
                    );
                  })}
                </div>
              )}
              {roomForm.resources_ids.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {roomForm.resources_ids.length} resource{roomForm.resources_ids.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRoomDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreatingRoom} className="gap-2">
                {isCreatingRoom && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Room
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Create Resource Dialog ─────────────────────── */}
      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateResource} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="resource_name">Resource Name</Label>
              <Input id="resource_name" placeholder="e.g. Projector" value={resourceForm.name} onChange={(e) => setResourceForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setResourceDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreatingResource} className="gap-2">
                {isCreatingResource && <Loader2 className="h-4 w-4 animate-spin" />}
                Add Resource
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
