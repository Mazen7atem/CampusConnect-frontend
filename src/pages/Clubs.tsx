import { useState } from 'react';
import { Plus, MoreHorizontal, Users, Calendar, FileText, BarChart3, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Club {
  id: string;
  name: string;
  manager: string;
  members: number;
  events: number;
  sessions: number;
  posts: number;
  status: 'active' | 'inactive';
}

const mockClubs: Club[] = [
  { id: '1', name: 'Tech Club', manager: 'Dr. Ahmed Salem', members: 120, events: 8, sessions: 24, posts: 45, status: 'active' },
  { id: '2', name: 'AI Club', manager: 'Dr. Sara Hassan', members: 85, events: 5, sessions: 18, posts: 32, status: 'active' },
  { id: '3', name: 'Sports Club', manager: 'Mohamed Ali', members: 200, events: 12, sessions: 36, posts: 67, status: 'active' },
  { id: '4', name: 'Photography Club', manager: 'Fatma Khaled', members: 45, events: 3, sessions: 12, posts: 89, status: 'active' },
  { id: '5', name: 'Debate Club', manager: 'Omar Ibrahim', members: 35, events: 6, sessions: 20, posts: 23, status: 'active' },
  { id: '6', name: 'Environmental Club', manager: 'Laila Mahmoud', members: 60, events: 4, sessions: 8, posts: 28, status: 'active' },
  { id: '7', name: 'Music Club', manager: 'Pending Assignment', members: 28, events: 0, sessions: 0, posts: 5, status: 'inactive' },
  { id: '8', name: 'Cultural Club', manager: 'Nour Ahmed', members: 95, events: 7, sessions: 15, posts: 52, status: 'active' },
];

const Clubs = () => {
  const { t } = useTranslation();
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const columns = [
    { 
      key: 'name', 
      header: t('club_name'),
      render: (club: Club) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {club.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{club.name}</span>
        </div>
      )
    },
    { key: 'manager', header: t('club_manager') },
    { key: 'members', header: t('club_members') },
    { key: 'events', header: t('club_events') },
    { key: 'sessions', header: 'Sessions' },
    { key: 'posts', header: t('club_posts') },
    { 
      key: 'status', 
      header: t('event_status'),
      render: (club: Club) => <StatusBadge status={club.status} />
    },
  ];

  const renderActions = (club: Club) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { setSelectedClub(club); setDetailsDialogOpen(true); }}>
          <BarChart3 className="w-4 h-4 mr-2" /> View Statistics
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Users className="w-4 h-4 mr-2" /> View Members
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Calendar className="w-4 h-4 mr-2" /> View Events
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileText className="w-4 h-4 mr-2" /> View Posts
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Edit className="w-4 h-4 mr-2" /> {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserPlus className="w-4 h-4 mr-2" /> {t('assign_manager')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" /> {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const totalMembers = clubs.reduce((sum, c) => sum + c.members, 0);
  const totalEvents = clubs.reduce((sum, c) => sum + c.events, 0);
  const activeClubs = clubs.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('clubs_management')}</h1>
          <p className="page-subtitle">Manage campus clubs and organizations</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          New Club
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{clubs.length}</p>
              <p className="text-sm text-muted-foreground">Total Clubs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">{activeClubs}</p>
              <p className="text-sm text-muted-foreground">Active Clubs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalMembers}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{totalEvents}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={clubs}
        columns={columns}
        actions={renderActions}
        searchPlaceholder="Search clubs..."
      />

      {/* Create Club Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Club</DialogTitle>
            <DialogDescription>Add a new club to the campus.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Club Name</Label>
              <Input id="name" placeholder="Enter club name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Input id="manager" placeholder="Select or enter manager name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Club description and objectives" rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={() => {
                toast.success('Club created successfully!');
                setCreateDialogOpen(false);
              }}>
                {t('create')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Club Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClub?.name} Statistics</DialogTitle>
          </DialogHeader>
          {selectedClub && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {selectedClub.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedClub.name}</h3>
                  <p className="text-muted-foreground">Manager: {selectedClub.manager}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{selectedClub.members}</p>
                        <p className="text-sm text-muted-foreground">Members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{selectedClub.events}</p>
                        <p className="text-sm text-muted-foreground">Events</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{selectedClub.sessions}</p>
                        <p className="text-sm text-muted-foreground">Sessions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{selectedClub.posts}</p>
                        <p className="text-sm text-muted-foreground">Posts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clubs;
