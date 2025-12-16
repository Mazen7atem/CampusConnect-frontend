import { useState } from 'react';
import { Plus, MoreHorizontal, Check, X, Edit, Trash2, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  organizer: string;
  attendees: number;
  status: 'pending' | 'active' | 'approved' | 'declined' | 'completed';
}

const mockEvents: Event[] = [
  { id: '1', name: 'Tech Talk 2024', date: '2024-12-15', location: 'Main Auditorium', organizer: 'Tech Club', attendees: 150, status: 'pending' },
  { id: '2', name: 'Career Fair', date: '2024-12-20', location: 'Exhibition Hall', organizer: 'Career Services', attendees: 500, status: 'approved' },
  { id: '3', name: 'AI Workshop', date: '2024-12-10', location: 'Lab A-201', organizer: 'AI Club', attendees: 45, status: 'active' },
  { id: '4', name: 'Cultural Night', date: '2024-11-25', location: 'Open Theater', organizer: 'Cultural Club', attendees: 300, status: 'completed' },
  { id: '5', name: 'Hackathon 2024', date: '2024-12-18', location: 'Innovation Center', organizer: 'CS Club', attendees: 100, status: 'pending' },
  { id: '6', name: 'Research Symposium', date: '2024-12-22', location: 'Conference Room', organizer: 'Research Office', attendees: 80, status: 'pending' },
  { id: '7', name: 'Sports Day', date: '2024-11-20', location: 'Sports Complex', organizer: 'Sports Club', attendees: 400, status: 'completed' },
  { id: '8', name: 'Art Exhibition', date: '2024-12-05', location: 'Gallery Hall', organizer: 'Art Club', attendees: 60, status: 'declined' },
];

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const columns = [
    { key: 'name', header: t('event_name') },
    { key: 'date', header: t('event_date') },
    { key: 'location', header: t('event_location') },
    { key: 'organizer', header: t('event_organizer') },
    { key: 'attendees', header: t('event_attendees') },
    { 
      key: 'status', 
      header: t('event_status'),
      render: (event: Event) => <StatusBadge status={event.status} />
    },
  ];

  const handleApprove = (event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'approved' as const } : e));
    toast.success(`Event "${event.name}" approved!`);
  };

  const handleDecline = (event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'declined' as const } : e));
    toast.error(`Event "${event.name}" declined.`);
  };

  const handleDelete = (event: Event) => {
    setEvents(prev => prev.filter(e => e.id !== event.id));
    toast.success(`Event "${event.name}" deleted.`);
  };

  const filterEvents = (status: string) => {
    if (status === 'all') return events;
    if (status === 'pending') return events.filter(e => e.status === 'pending');
    if (status === 'past') return events.filter(e => e.status === 'completed');
    return events.filter(e => ['approved', 'active'].includes(e.status));
  };

  const renderActions = (event: Event) => (
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
            <DropdownMenuItem onClick={() => handleApprove(event)} className="text-success">
              <Check className="w-4 h-4 mr-2" /> {t('approve')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDecline(event)} className="text-destructive">
              <X className="w-4 h-4 mr-2" /> {t('decline')}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Send className="w-4 h-4 mr-2" /> {t('send_updates')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(event)} className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" /> {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('events_management')}</h1>
          <p className="page-subtitle">Manage and approve all campus events</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t('new_event')}
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t('all_events')}</TabsTrigger>
          <TabsTrigger value="pending">{t('pending_approval')}</TabsTrigger>
          <TabsTrigger value="active">{t('active')}</TabsTrigger>
          <TabsTrigger value="past">{t('past_events')}</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'active', 'past'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <DataTable
              data={filterEvents(tab)}
              columns={columns}
              actions={renderActions}
              searchPlaceholder="Search events..."
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('new_event')}</DialogTitle>
            <DialogDescription>Create a new event for the campus.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('event_name')}</Label>
              <Input id="name" placeholder="Enter event name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">{t('event_date')}</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('event_location')}</Label>
                <Input id="location" placeholder="Location" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Event description" rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={() => {
                toast.success('Event created successfully!');
                setCreateDialogOpen(false);
              }}>
                {t('create')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('event_date')}</p>
                  <p className="font-medium">{selectedEvent.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('event_location')}</p>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('event_organizer')}</p>
                  <p className="font-medium">{selectedEvent.organizer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('event_attendees')}</p>
                  <p className="font-medium">{selectedEvent.attendees}</p>
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

export default Events;
