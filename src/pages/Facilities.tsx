import { useState } from 'react';
import { Building2, Dumbbell, TreePine, MoreHorizontal, Check, X, LogIn, LogOut } from 'lucide-react';
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
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface StudyRoom {
  id: string;
  name: string;
  capacity: number;
  building: string;
  bookedBy: string;
  date: string;
  time: string;
  status: 'pending' | 'active' | 'completed';
  checkedIn: boolean;
}

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

const mockStudyRooms: StudyRoom[] = [
  { id: '1', name: 'Study Room A-101', capacity: 6, building: 'Building A', bookedBy: 'Ahmed Hassan', date: '2024-12-11', time: '10:00-12:00', status: 'active', checkedIn: true },
  { id: '2', name: 'Study Room A-102', capacity: 8, building: 'Building A', bookedBy: 'Sara Mohamed', date: '2024-12-11', time: '14:00-16:00', status: 'pending', checkedIn: false },
  { id: '3', name: 'Study Room B-201', capacity: 4, building: 'Building B', bookedBy: 'Omar Ali', date: '2024-12-11', time: '09:00-11:00', status: 'active', checkedIn: false },
  { id: '4', name: 'Study Room C-105', capacity: 10, building: 'Building C', bookedBy: 'Fatma Khaled', date: '2024-12-10', time: '15:00-17:00', status: 'completed', checkedIn: true },
];

const mockSportsFacilities: SportsFacility[] = [
  { id: '1', name: 'Main Gym', type: 'gym', capacity: 50, bookedBy: 'Sports Club', date: '2024-12-11', time: '08:00-10:00', status: 'active' },
  { id: '2', name: 'Football Field', type: 'playground', capacity: 30, bookedBy: 'Football Team', date: '2024-12-12', time: '16:00-18:00', status: 'pending' },
  { id: '3', name: 'Basketball Court', type: 'playground', capacity: 20, bookedBy: 'Basketball Club', date: '2024-12-11', time: '14:00-16:00', status: 'approved' },
  { id: '4', name: 'Tennis Court', type: 'playground', capacity: 4, bookedBy: 'Youssef Ibrahim', date: '2024-12-13', time: '10:00-11:00', status: 'pending' },
  { id: '5', name: 'Fitness Center', type: 'gym', capacity: 25, bookedBy: 'Wellness Club', date: '2024-12-11', time: '06:00-08:00', status: 'completed' },
];

const Facilities = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(mockStudyRooms);
  const [sportsFacilities, setSportsFacilities] = useState<SportsFacility[]>(mockSportsFacilities);

  const canManageStudyRooms = hasPermission(['system_admin', 'event_room_admin']);
  const canManageSports = hasPermission(['system_admin', 'sports_admin']);

  const studyRoomColumns = [
    { key: 'name', header: t('room_name') },
    { key: 'capacity', header: t('capacity') },
    { key: 'building', header: 'Building' },
    { key: 'bookedBy', header: 'Booked By' },
    { key: 'date', header: 'Date' },
    { key: 'time', header: 'Time' },
    { 
      key: 'status', 
      header: t('booking_status'),
      render: (room: StudyRoom) => <StatusBadge status={room.status} />
    },
    {
      key: 'checkedIn',
      header: 'Check-in',
      render: (room: StudyRoom) => (
        <span className={room.checkedIn ? 'text-success font-medium' : 'text-muted-foreground'}>
          {room.checkedIn ? 'Checked In' : 'Not Yet'}
        </span>
      )
    },
  ];

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

  const handleCheckIn = (room: StudyRoom) => {
    setStudyRooms(prev => prev.map(r => r.id === room.id ? { ...r, checkedIn: true } : r));
    toast.success(`Checked in to ${room.name}`);
  };

  const handleCheckOut = (room: StudyRoom) => {
    setStudyRooms(prev => prev.map(r => r.id === room.id ? { ...r, checkedIn: false, status: 'completed' as const } : r));
    toast.success(`Checked out from ${room.name}`);
  };

  const handleApprove = (facility: SportsFacility) => {
    setSportsFacilities(prev => prev.map(f => f.id === facility.id ? { ...f, status: 'approved' as const } : f));
    toast.success(`Reservation for ${facility.name} approved!`);
  };

  const handleCancel = (facility: SportsFacility) => {
    setSportsFacilities(prev => prev.filter(f => f.id !== facility.id));
    toast.error(`Reservation for ${facility.name} cancelled.`);
  };

  const renderStudyRoomActions = (room: StudyRoom) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {room.status === 'active' && !room.checkedIn && (
          <DropdownMenuItem onClick={() => handleCheckIn(room)} className="text-success">
            <LogIn className="w-4 h-4 mr-2" /> {t('check_in')}
          </DropdownMenuItem>
        )}
        {room.status === 'active' && room.checkedIn && (
          <DropdownMenuItem onClick={() => handleCheckOut(room)} className="text-primary">
            <LogOut className="w-4 h-4 mr-2" /> {t('check_out')}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <X className="w-4 h-4 mr-2" /> Cancel Booking
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
            <DropdownMenuItem onClick={() => handleApprove(facility)} className="text-success">
              <Check className="w-4 h-4 mr-2" /> {t('approve')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCancel(facility)} className="text-destructive">
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

  const gymFacilities = sportsFacilities.filter(f => f.type === 'gym');
  const playgrounds = sportsFacilities.filter(f => f.type === 'playground');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('facilities_management')}</h1>
          <p className="page-subtitle">Manage study rooms, gym, and sports facilities</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studyRooms.filter(r => r.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active Study Rooms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{gymFacilities.length}</p>
                <p className="text-sm text-muted-foreground">Gym Reservations</p>
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
                <p className="text-sm text-muted-foreground">Playground Reservations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="study-rooms" className="w-full">
        <TabsList className="mb-4">
          {canManageStudyRooms && <TabsTrigger value="study-rooms">{t('study_rooms')}</TabsTrigger>}
          {canManageSports && <TabsTrigger value="gym">{t('gym')}</TabsTrigger>}
          {canManageSports && <TabsTrigger value="playgrounds">{t('playgrounds')}</TabsTrigger>}
        </TabsList>

        {canManageStudyRooms && (
          <TabsContent value="study-rooms">
            <DataTable
              data={studyRooms}
              columns={studyRoomColumns}
              actions={renderStudyRoomActions}
              searchPlaceholder="Search study rooms..."
            />
          </TabsContent>
        )}

        {canManageSports && (
          <>
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
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Facilities;
