import { useState } from 'react';
import { Dumbbell, TreePine, Trophy, MoreHorizontal, Check, X, Plus, Eye, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SportsFacility {
  id: string;
  name: string;
  type: 'gym' | 'playground';
  capacity: number;
  bookedBy: string;
  date: string;
  time: string;
  status: 'pending' | 'active' | 'approved' | 'completed';
}

interface SportsEvent {
  id: string;
  name: string;
  sport: string;
  date: string;
  facility: string;
  participants: number;
  status: 'pending' | 'active' | 'approved' | 'completed';
}

const mockSportsFacilities: SportsFacility[] = [
  { id: '1', name: 'Main Gym', type: 'gym', capacity: 50, bookedBy: 'Sports Club', date: '2024-12-11', time: '08:00-10:00', status: 'active' },
  { id: '2', name: 'Football Field', type: 'playground', capacity: 30, bookedBy: 'Football Team', date: '2024-12-12', time: '16:00-18:00', status: 'pending' },
  { id: '3', name: 'Basketball Court', type: 'playground', capacity: 20, bookedBy: 'Basketball Club', date: '2024-12-11', time: '14:00-16:00', status: 'approved' },
  { id: '4', name: 'Tennis Court', type: 'playground', capacity: 4, bookedBy: 'Youssef Ibrahim', date: '2024-12-13', time: '10:00-11:00', status: 'pending' },
  { id: '5', name: 'Fitness Center', type: 'gym', capacity: 25, bookedBy: 'Wellness Club', date: '2024-12-11', time: '06:00-08:00', status: 'completed' },
  { id: '6', name: 'Swimming Pool', type: 'gym', capacity: 15, bookedBy: 'Swimming Club', date: '2024-12-14', time: '09:00-11:00', status: 'pending' },
];

const mockSportsEvents: SportsEvent[] = [
  { id: '1', name: 'Inter-Faculty Football', sport: 'Football', date: '2024-12-15', facility: 'Football Field', participants: 44, status: 'approved' },
  { id: '2', name: 'Basketball Tournament', sport: 'Basketball', date: '2024-12-18', facility: 'Basketball Court', participants: 30, status: 'pending' },
  { id: '3', name: 'Tennis Singles', sport: 'Tennis', date: '2024-12-20', facility: 'Tennis Court', participants: 16, status: 'pending' },
  { id: '4', name: 'Fitness Challenge', sport: 'Fitness', date: '2024-12-10', facility: 'Main Gym', participants: 40, status: 'completed' },
  { id: '5', name: 'Swimming Gala', sport: 'Swimming', date: '2024-12-22', facility: 'Swimming Pool', participants: 24, status: 'pending' },
];

const Sports = () => {
  const { t } = useTranslation();
  const [sportsFacilities, setSportsFacilities] = useState<SportsFacility[]>(mockSportsFacilities);
  const [sportsEvents, setSportsEvents] = useState<SportsEvent[]>(mockSportsEvents);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);

  const sportsColumns = [
    { key: 'name', header: 'Facility Name' },
    { 
      key: 'type', 
      header: 'Type',
      render: (facility: SportsFacility) => (
        <span className="capitalize">{facility.type}</span>
      )
    },
    { key: 'capacity', header: t('capacity') },
    { key: 'bookedBy', header: 'Booked By' },
    { key: 'date', header: 'Date' },
    { key: 'time', header: 'Time' },
    { 
      key: 'status', 
      header: t('booking_status'),
      render: (facility: SportsFacility) => <StatusBadge status={facility.status} />
    },
  ];

  const eventsColumns = [
    { key: 'name', header: 'Event Name' },
    { key: 'sport', header: 'Sport' },
    { key: 'date', header: 'Date' },
    { key: 'facility', header: 'Facility' },
    { key: 'participants', header: 'Participants' },
    { 
      key: 'status', 
      header: t('event_status'),
      render: (event: SportsEvent) => <StatusBadge status={event.status} />
    },
  ];

  const handleApproveFacility = (facility: SportsFacility) => {
    setSportsFacilities(prev => prev.map(f => f.id === facility.id ? { ...f, status: 'approved' as const } : f));
    toast.success(`Reservation for ${facility.name} approved!`);
  };

  const handleCancelFacility = (facility: SportsFacility) => {
    setSportsFacilities(prev => prev.filter(f => f.id !== facility.id));
    toast.error(`Reservation for ${facility.name} cancelled.`);
  };

  const handleApproveEvent = (event: SportsEvent) => {
    setSportsEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'approved' as const } : e));
    toast.success(`Event "${event.name}" approved!`);
  };

  const handleDeclineEvent = (event: SportsEvent) => {
    setSportsEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'pending' as const } : e));
    toast.error(`Event "${event.name}" declined.`);
  };

  const handleDeleteEvent = (event: SportsEvent) => {
    setSportsEvents(prev => prev.filter(e => e.id !== event.id));
    toast.success(`Event "${event.name}" deleted.`);
  };

  const renderSportsActions = (facility: SportsFacility) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {facility.status === 'pending' && (
          <>
            <DropdownMenuItem onClick={() => handleApproveFacility(facility)} className="text-success">
              <Check className="w-4 h-4 mr-2" /> {t('approve')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCancelFacility(facility)} className="text-destructive">
              <X className="w-4 h-4 mr-2" /> {t('decline')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="text-destructive">
          <X className="w-4 h-4 mr-2" /> Cancel Booking
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderEventsActions = (event: SportsEvent) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { setSelectedEvent(event); setViewDialogOpen(true); }}>
          <Eye className="w-4 h-4 mr-2" /> {t('view')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="w-4 h-4 mr-2" /> {t('edit')}
        </DropdownMenuItem>
        {event.status === 'pending' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleApproveEvent(event)} className="text-success">
              <Check className="w-4 h-4 mr-2" /> {t('approve')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeclineEvent(event)} className="text-destructive">
              <X className="w-4 h-4 mr-2" /> {t('decline')}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteEvent(event)} className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" /> {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const gymFacilities = sportsFacilities.filter(f => f.type === 'gym');
  const playgrounds = sportsFacilities.filter(f => f.type === 'playground');
  const pendingReservations = sportsFacilities.filter(f => f.status === 'pending').length;
  const pendingEvents = sportsEvents.filter(e => e.status === 'pending').length;
  const totalParticipants = sportsEvents.reduce((sum, e) => sum + e.participants, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('sports_management')}</h1>
          <p className="page-subtitle">Manage sports facilities, events, and reservations</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t('new_sports_event')}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{gymFacilities.length}</p>
                <p className="text-sm text-muted-foreground">Gym Facilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TreePine className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{playgrounds.length}</p>
                <p className="text-sm text-muted-foreground">Playgrounds</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{pendingReservations + pendingEvents}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{totalParticipants}</p>
                <p className="text-sm text-muted-foreground">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="events">{t('sports_events')}</TabsTrigger>
          <TabsTrigger value="gym">{t('gym')}</TabsTrigger>
          <TabsTrigger value="playgrounds">{t('playgrounds')}</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <DataTable
            data={sportsEvents}
            columns={eventsColumns}
            actions={renderEventsActions}
            searchPlaceholder="Search sports events..."
          />
        </TabsContent>

        <TabsContent value="gym">
          <DataTable
            data={gymFacilities}
            columns={sportsColumns}
            actions={renderSportsActions}
            searchPlaceholder="Search gym reservations..."
          />
        </TabsContent>

        <TabsContent value="playgrounds">
          <DataTable
            data={playgrounds}
            columns={sportsColumns}
            actions={renderSportsActions}
            searchPlaceholder="Search playground reservations..."
          />
        </TabsContent>
      </Tabs>

      {/* Create Sports Event Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('new_sports_event')}</DialogTitle>
            <DialogDescription>Create a new sports event or tournament.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" placeholder="Enter event name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Input id="sport" placeholder="e.g. Football, Basketball" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facility">Facility</Label>
                <Input id="facility" placeholder="Select facility" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Max Participants</Label>
                <Input id="participants" type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Event description and rules" rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={() => {
                toast.success('Sports event created successfully!');
                setCreateDialogOpen(false);
              }}>
                {t('create')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Sports Event Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sport</p>
                  <p className="font-medium">{selectedEvent.sport}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedEvent.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Facility</p>
                  <p className="font-medium">{selectedEvent.facility}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="font-medium">{selectedEvent.participants}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('event_status')}</p>
                <StatusBadge status={selectedEvent.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sports;
