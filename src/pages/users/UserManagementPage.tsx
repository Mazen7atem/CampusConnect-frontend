import { useState, type FormEvent } from 'react';
import {
  Search,
  UserPlus,
  ShieldBan,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  Users,
} from 'lucide-react';
import {
  useGetStudentsQuery,
  useLazySearchStudentsQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useCreateUserMutation,
} from '@/entities/user';
import type { CreateUserPayload } from '@/entities/user';
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

// ─── Initial Form State ──────────────────────────────────────────────
// Matches the strict payload for POST /api/admin/users
const emptyForm: CreateUserPayload = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  user_name: '',
  role: 'student',
  phone: '',
  faculty: '',
  major: '',
  level: '',
  picture: '',
  in_dorms: false,
};

// ─── Table Skeleton ──────────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-level-1 animate-pulse"
      >
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="ml-auto h-8 w-16 rounded bg-muted" />
      </div>
    ))}
  </div>
);

// ─── User Management Page ────────────────────────────────────────────
export const UserManagementPage = () => {
  const { data: students, isLoading, isError, refetch } = useGetStudentsQuery();
  const [triggerSearch, { data: searchResults, isFetching: isSearching }] =
    useLazySearchStudentsQuery();
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [banningId, setBanningId] = useState<string | null>(null);
  const [unbanningId, setUnbanningId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateUserPayload>(emptyForm);

  // Determine displayed data: search results override base list
  const displayedStudents = searchQuery.trim()
    ? searchResults ?? []
    : students ?? [];

  // ── Search Handler ─────────────────────────────────────────────────
  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      triggerSearch(q);
    } else {
      refetch();
    }
  };

  // ── Ban Handler ────────────────────────────────────────────────
  const handleBan = async (studentId: string) => {
    setBanningId(studentId);
    try {
      await banUser(studentId).unwrap();
      toast.success('User banned successfully');
    } catch (error) {
      console.error('[banUser] failed:', error);
      toast.error('Failed to ban user');
    } finally {
      setBanningId(null);
    }
  };

  // ── Unban Handler ──────────────────────────────────────────────
  const handleUnban = async (studentId: string) => {
    setUnbanningId(studentId);
    try {
      await unbanUser(studentId).unwrap();
      toast.success('User unbanned successfully');
    } catch (error) {
      console.error('[unbanUser] failed:', error);
      toast.error('Failed to unban user');
    } finally {
      setUnbanningId(null);
    }
  };

  // ── Create User Handler ────────────────────────────────────────────
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Payload is already the exact 6-field snake_case shape
      const result = await createUser(form).unwrap();
      console.log('[createUser] success:', result);
      toast.success('User created successfully');
      setDialogOpen(false);
      setForm(emptyForm);
      // Table auto-refreshes via invalidatesTags: ['User']
    } catch (error) {
      console.error('[createUser] failed:', error);
      toast.error('Failed to create user');
    }
  };

  // ── Form Field Helper ──────────────────────────────────────────────
  const updateField = (field: keyof CreateUserPayload, value: string | boolean | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Search, review, and manage student accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* ── Search Bar ────────────────────────────────── */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by name, email, faculty, or major..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-md"
        />
        <Button variant="outline" onClick={handleSearch} disabled={isSearching} className="gap-2">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search
        </Button>
      </div>

      {/* ── Loading ────────────────────────────────────── */}
      {isLoading && <TableSkeleton />}

      {/* ── Error ──────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <h3 className="text-lg font-semibold">Failed to load students</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Could not fetch student records. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Data Table ─────────────────────────────────── */}
      {!isLoading && !isError && (
        <>
          {displayedStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest shadow-level-1 p-16 text-center">
              <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No students found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? 'Try a different search term.' : 'No student records available.'}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-level-1">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-surface-container-low">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Faculty</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Major</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reservations</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Complaints</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {displayedStudents.map((student) => (
                      <tr
                        key={student.student_id}
                        className="transition-colors hover:bg-surface-container-low"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{student.student_name}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{student.student_email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm">{student.faculty}</td>
                        <td className="px-4 py-3.5 text-sm">{student.major}</td>
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={student.status === 'banned' ? 'destructive' : 'default'}
                            className={`capitalize ${
                              student.status === 'banned'
                                ? ''
                                : 'bg-primary-fixed text-primary-on-fixed hover:bg-primary-fixed/80 rounded-full px-3 py-1 border-transparent'
                            }`}
                          >
                            {student.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-sm">{student.reservations}</td>
                        <td className="px-4 py-3.5 text-sm">{student.complaints}</td>
                        <td className="px-4 py-3.5 text-right">
                          {student.status === 'banned' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={unbanningId === student.student_id}
                              onClick={() => handleUnban(student.student_id)}
                              className="gap-1.5 border-green-500 text-green-600 hover:bg-green-50"
                            >
                              {unbanningId === student.student_id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <ShieldCheck className="h-3.5 w-3.5" />
                              )}
                              Unban
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={banningId === student.student_id}
                              onClick={() => handleBan(student.student_id)}
                              className="gap-1.5 bg-error text-error-foreground rounded hover:bg-error/90"
                            >
                              {banningId === student.student_id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <ShieldBan className="h-3.5 w-3.5" />
                              )}
                              Ban
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-outline-variant bg-surface-container-low px-4 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Showing{' '}
                  <span className="font-medium text-foreground">{displayedStudents.length}</span>{' '}
                  student{displayedStudents.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Create User Dialog ─────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" value={form.first_name} onChange={(e) => updateField('first_name', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" value={form.last_name} onChange={(e) => updateField('last_name', e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user_name">Username</Label>
                <Input id="user_name" value={form.user_name} onChange={(e) => updateField('user_name', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* ── Student-Only Fields ──────────────────────── */}
            {form.role === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Faculty</Label>
                    <Input id="faculty" value={form.faculty ?? ''} onChange={(e) => updateField('faculty', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Input id="major" value={form.major ?? ''} onChange={(e) => updateField('major', e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Input id="level" value={form.level ?? ''} onChange={(e) => updateField('level', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="picture">Picture URL</Label>
                    <Input id="picture" type="url" value={form.picture ?? ''} onChange={(e) => updateField('picture', e.target.value)} required />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="in_dorms"
                    type="checkbox"
                    checked={form.in_dorms ?? false}
                    onChange={(e) => updateField('in_dorms', e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <Label htmlFor="in_dorms" className="text-sm font-normal">
                    Lives in dorms
                  </Label>
                </div>
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating} className="gap-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
