import { useState, type FormEvent } from 'react';
import {
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  Building2,
  ToggleLeft,
} from 'lucide-react';
import {
  useGetFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
} from '@/entities/facility';
import type { CreateFacilityPayload } from '@/entities/facility';
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

// ─── Status Variant Map ──────────────────────────────────────────────
const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  available: 'default',
  closed: 'destructive',
  under_maintenance: 'secondary',
};

const statusLabel: Record<string, string> = {
  available: 'Available',
  closed: 'Closed',
  under_maintenance: 'Maintenance',
};

// ─── Table Skeleton ──────────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 rounded-lg border border-outline-variant bg-card p-4 animate-pulse">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="ml-auto h-8 w-16 rounded bg-muted" />
      </div>
    ))}
  </div>
);

// ─── Facility Management Page ────────────────────────────────────────
export const FacilityManagementPage = () => {
  const { data: facilities, isLoading, isError, refetch } = useGetFacilitiesQuery();
  const [createFacility, { isLoading: isCreating }] = useCreateFacilityMutation();
  const [updateFacility] = useUpdateFacilityMutation();

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState<CreateFacilityPayload>({
    name: '',
    location: '',
    min_capacity: 0,
    max_capacity: 0,
    type: '',
    status: 'available',
  });

  // ── Status Change Handler ─────────────────────────────────────────────
  const handleStatusChange = async (
    id: number,
    status: 'available' | 'closed' | 'under_maintenance'
  ) => {
    setUpdatingId(id);
    try {
      await updateFacility({ id, status }).unwrap();
      toast.success('Facility status updated');
    } catch {
      toast.error('Failed to update facility status');
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Create Handler ─────────────────────────────────────────────────
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (createForm.min_capacity > createForm.max_capacity) {
      toast.error('Min capacity cannot exceed max capacity');
      return;
    }
    try {
      await createFacility(createForm).unwrap();
      toast.success('Facility created successfully');
      setCreateOpen(false);
      setCreateForm({ name: '', location: '', min_capacity: 0, max_capacity: 0, type: '', status: 'available' });
    } catch {
      toast.error('Failed to create facility');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Facility Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage campus facilities (gyms, playgrounds, etc.)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Facility
          </Button>
        </div>
      </div>

      {/* ── Loading ────────────────────────────────────── */}
      {isLoading && <TableSkeleton />}

      {/* ── Error ──────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <h3 className="text-lg font-semibold">Failed to load facilities</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Could not fetch facility records. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Data Table ─────────────────────────────────── */}
      {!isLoading && !isError && facilities && (
        <>
          {facilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-card p-16 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No facilities found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No facilities have been created yet.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-outline-variant bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-surface-container-low">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capacity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {facilities.map((f) => (
                      <tr key={f.facility_id} className="transition-colors hover:bg-surface-container-low">
                        <td className="px-4 py-3.5 text-sm font-medium">{f.name}</td>
                        <td className="px-4 py-3.5 text-sm capitalize">{f.type}</td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground">{f.location_description}</td>
                        <td className="px-4 py-3.5 text-sm">{f.min_capacity} – {f.max_capacity}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant={statusVariant[f.status] ?? 'secondary'} className="capitalize">
                            {statusLabel[f.status] ?? f.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <select
                            value={f.status}
                            disabled={updatingId === f.facility_id}
                            onChange={(e) =>
                              handleStatusChange(
                                f.facility_id,
                                e.target.value as 'available' | 'closed' | 'under_maintenance'
                              )
                            }
                            className="rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                          >
                            <option value="available">Available</option>
                            <option value="closed">Closed</option>
                            <option value="under_maintenance">Maintenance</option>
                          </select>
                          {updatingId === f.facility_id && (
                            <Loader2 className="inline ml-1 h-3.5 w-3.5 animate-spin text-muted-foreground" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-outline-variant bg-surface-container-low px-4 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{facilities.length}</span> facilit{facilities.length !== 1 ? 'ies' : 'y'}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Create Facility Dialog ─────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Facility</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="fac-name">Facility Name</Label>
              <Input id="fac-name" placeholder="e.g. Main Gym" value={createForm.name} onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fac-location">Location</Label>
              <Input id="fac-location" placeholder="e.g. Building A, Ground Floor" value={createForm.location} onChange={(e) => setCreateForm((p) => ({ ...p, location: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fac-type">Type</Label>
                <select
                  id="fac-type"
                  value={createForm.type}
                  onChange={(e) => setCreateForm((p) => ({ ...p, type: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="" disabled>Select type…</option>
                  <option value="gym">Gym</option>
                  <option value="playground">Playground</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fac-status">Status</Label>
                <select
                  id="fac-status"
                  value={createForm.status}
                  onChange={(e) => setCreateForm((p) => ({ ...p, status: e.target.value as CreateFacilityPayload['status'] }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="available">Available</option>
                  <option value="closed">Closed</option>
                  <option value="under_maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fac-min">Min Capacity</Label>
                <Input id="fac-min" type="number" min={0} value={createForm.min_capacity || ''} onChange={(e) => setCreateForm((p) => ({ ...p, min_capacity: Number(e.target.value) }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fac-max">Max Capacity</Label>
                <Input id="fac-max" type="number" min={1} value={createForm.max_capacity || ''} onChange={(e) => setCreateForm((p) => ({ ...p, max_capacity: Number(e.target.value) }))} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating} className="gap-2">
                {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Facility
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
