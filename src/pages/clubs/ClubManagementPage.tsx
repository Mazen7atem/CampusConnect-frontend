import { useState, type FormEvent } from 'react';
import {
  Plus,
  Pencil,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import {
  useGetClubsQuery,
  useLazyGetClubDetailsQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
} from '@/entities/club';
import type { CreateClubPayload, UpdateClubPayload } from '@/entities/club';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <div key={i} className="flex items-center gap-4 rounded-lg border border-outline-variant bg-card p-4 animate-pulse">
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="ml-auto h-8 w-16 rounded bg-muted" />
      </div>
    ))}
  </div>
);

// ─── Club Management Page ────────────────────────────────────────────
export const ClubManagementPage = () => {
  const { data: clubs, isLoading, isError, refetch } = useGetClubsQuery();
  const [triggerGetDetails] = useLazyGetClubDetailsQuery();
  const [createClub, { isLoading: isCreating }] = useCreateClubMutation();
  const [updateClub, { isLoading: isUpdating }] = useUpdateClubMutation();

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Create form
  const [createForm, setCreateForm] = useState<CreateClubPayload>({
    name: '',
    description: '',
    email: '',
    std_ids: [],
  });
  const [stdIdsInput, setStdIdsInput] = useState('');

  // Edit form
  const [editForm, setEditForm] = useState<UpdateClubPayload>({
    name: '',
    description: '',
    logo: '',
    cover: '',
  });

  // ── Open Edit Dialog (prefill from getClubDetails) ─────────────────
  const handleOpenEdit = async (clubId: number) => {
    setEditId(clubId);
    try {
      const club = await triggerGetDetails(clubId).unwrap();
      setEditForm({
        name: club.name,
        description: club.description,
        logo: club.logo ?? '',
        cover: club.cover ?? '',
      });
      setEditOpen(true);
    } catch {
      toast.error('Failed to load club details');
    }
  };

  // ── Create Handler ─────────────────────────────────────────────────
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Parse comma-separated student IDs
      const parsedIds = stdIdsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number)
        .filter((n) => !isNaN(n));

      if (parsedIds.length === 0) {
        toast.error('Please enter at least one club manager student ID');
        return;
      }

      await createClub({ ...createForm, std_ids: parsedIds }).unwrap();
      toast.success('Club created successfully');
      setCreateOpen(false);
      setCreateForm({ name: '', description: '', email: '', std_ids: [] });
      setStdIdsInput('');
    } catch {
      toast.error('Failed to create club');
    }
  };

  // ── Update Handler ─────────────────────────────────────────────────
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      await updateClub({ id: editId, body: editForm }).unwrap();
      toast.success('Club updated successfully');
      setEditOpen(false);
      setEditId(null);
    } catch {
      toast.error('Failed to update club');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Club Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View, create, and manage campus clubs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Club
          </Button>
        </div>
      </div>

      {/* ── Loading ────────────────────────────────────── */}
      {isLoading && <TableSkeleton />}

      {/* ── Error ──────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <h3 className="text-lg font-semibold">Failed to load clubs</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Could not fetch club records. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Data Table ─────────────────────────────────── */}
      {!isLoading && !isError && clubs && (
        <>
          {clubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-card p-16 text-center">
              <ShieldCheck className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No clubs found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No clubs have been created yet.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-outline-variant bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-surface-container-low">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Followers</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Events</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {clubs.map((club) => (
                      <tr key={club.id} className="transition-colors hover:bg-surface-container-low">
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium">{club.name}</span>
                        </td>
                        <td className="px-4 py-3.5 text-sm">{club.club_admin_name}</td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground">{club.email}</td>
                        <td className="px-4 py-3.5 text-sm">{club.followers_count}</td>
                        <td className="px-4 py-3.5 text-sm">{club.event_number}</td>
                        <td className="px-4 py-3.5 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleOpenEdit(club.id)}
                            className="gap-1.5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-outline-variant bg-surface-container-low px-4 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{clubs.length}</span> club{clubs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Create Club Dialog ─────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Club</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="club-name">Club Name</Label>
              <Input id="club-name" value={createForm.name} onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="club-desc">Description</Label>
              <textarea
                id="club-desc"
                value={createForm.description}
                onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="club-email">Email</Label>
              <Input id="club-email" type="email" value={createForm.email} onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="club-std-ids">Club Manager Student IDs</Label>
              <Input
                id="club-std-ids"
                placeholder="e.g. 1, 5, 12"
                value={stdIdsInput}
                onChange={(e) => setStdIdsInput(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Comma-separated student IDs to assign as club managers.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating} className="gap-2">
                {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Club
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Club Dialog ───────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Club</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Club Name</Label>
              <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <textarea
                id="edit-desc"
                value={editForm.description}
                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo">Logo URL</Label>
              <Input id="edit-logo" type="url" value={editForm.logo} onChange={(e) => setEditForm((p) => ({ ...p, logo: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cover">Cover URL</Label>
              <Input id="edit-cover" type="url" value={editForm.cover} onChange={(e) => setEditForm((p) => ({ ...p, cover: e.target.value }))} placeholder="https://..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isUpdating} className="gap-2">
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
