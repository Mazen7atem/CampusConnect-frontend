import { useState } from 'react';
import { Plus, MoreHorizontal, Check, X, Edit, Trash2, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';

interface Session {
  id: string;
  name: string;
  club: string;
  date: string;
  time: string;
  room: string;
  attendees: number;
  capacity: number;
  status: 'pending' | 'active' | 'approved' | 'completed';
}

const mockSessions: Session[] = [
  { id: '1', name: 'Web Development Workshop', club: 'Tech Club', date: '2024-12-12', time: '14:00', room: 'Lab A-101', attendees: 25, capacity: 30, status: 'pending' },
  { id: '2', name: 'Photography Basics', club: 'Art Club', date: '2024-12-14', time: '16:00', room: 'Studio B', attendees: 15, capacity: 20, status: 'approved' },
  { id: '3', name: 'Machine Learning 101', club: 'AI Club', date: '2024-12-11', time: '10:00', room: 'Lab C-205', attendees: 40, capacity: 45, status: 'active' },
  { id: '4', name: 'Debate Training', club: 'Debate Club', date: '2024-12-08', time: '15:00', room: 'Conference A', attendees: 12, capacity: 15, status: 'completed' },
  { id: '5', name: 'Startup Pitch Practice', club: 'Entrepreneurship Club', date: '2024-12-16', time: '11:00', room: 'Meeting Room 3', attendees: 8, capacity: 10, status: 'pending' },
  { id: '6', name: 'Arabic Calligraphy', club: 'Cultural Club', date: '2024-12-18', time: '13:00', room: 'Art Room', attendees: 18, capacity: 25, status: 'approved' },
];

const Sessions = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [attendeesDialogOpen, setAttendeesDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const columns = [
    { key: 'name', header: t('session_name') },
    { key: 'club', header: t('session_club') },
    { key: 'date', header: t('session_date') },
    { key: 'time', header: t('session_time') },
    { key: 'room', header: t('session_room') },
    { 
      key: 'attendees', 
      header: t('event_attendees'),
      render: (session: Session) => (
        <span className={session.attendees >= session.capacity ? 'text-destructive font-medium' : ''}>
          {session.attendees}/{session.capacity}
        </span>
      )
    },
    { 
      key: 'status', 
      header: t('event_status'),
      render: (session: Session) => <StatusBadge status={session.status} />
    },
  ];

  const handleApprove = (session: Session) => {
    setSessions(prev => prev.map(s => s.id === session.id ? { ...s, status: 'approved' as const } : s));
    toast.success(`Session "${session.name}" approved!`);
  };

  const handleDecline = (session: Session) => {
    setSessions(prev => prev.filter(s => s.id !== session.id));
    toast.error(`Session "${session.name}" cancelled.`);
  };

  const renderActions = (session: Session) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { setSelectedSession(session); setAttendeesDialogOpen(true); }}>
          <Users className="w-4 h-4 mr-2" /> View Attendees
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="w-4 h-4 mr-2" /> {t('edit')}
        </DropdownMenuItem>
        {session.status === 'pending' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleApprove(session)} className="text-success">
              <Check className="w-4 h-4 mr-2" /> {t('approve')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDecline(session)} className="text-destructive">
              <X className="w-4 h-4 mr-2" /> Cancel Session
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" /> {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const pendingCount = sessions.filter(s => s.status === 'pending').length;
  const activeCount = sessions.filter(s => s.status === 'active').length;
  const totalAttendees = sessions.reduce((sum, s) => sum + s.attendees, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('sessions_management')}</h1>
          <p className="page-subtitle">Manage club sessions and workshops</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          New Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{sessions.length}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">{totalAttendees}</p>
              <p className="text-sm text-muted-foreground">Total Attendees</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={sessions}
        columns={columns}
        actions={renderActions}
        searchPlaceholder="Search sessions..."
      />

      {/* Create Session Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Session</DialogTitle>
            <DialogDescription>Create a new club session or workshop.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Session Name</Label>
              <Input id="name" placeholder="Enter session name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="club">Club</Label>
                <Input id="club" placeholder="Select club" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input id="room" placeholder="Select room" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" placeholder="Maximum attendees" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={() => {
                toast.success('Session created successfully!');
                setCreateDialogOpen(false);
              }}>
                {t('create')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendees Dialog */}
      <Dialog open={attendeesDialogOpen} onOpenChange={setAttendeesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Attendees</DialogTitle>
            <DialogDescription>{selectedSession?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              {selectedSession?.status === 'active' || selectedSession?.status === 'completed' 
                ? `${selectedSession?.attendees} attendees registered`
                : 'Attendee list will be available once the session starts.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sessions;
