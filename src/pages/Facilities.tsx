import { useState } from 'react';
import { Building2, MoreHorizontal, X, LogIn, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

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

const mockStudyRooms: StudyRoom[] = [
  { id: '1', name: 'Study Room A-101', capacity: 6, building: 'Building A', bookedBy: 'Ahmed Hassan', date: '2024-12-11', time: '10:00-12:00', status: 'active', checkedIn: true },
  { id: '2', name: 'Study Room A-102', capacity: 8, building: 'Building A', bookedBy: 'Sara Mohamed', date: '2024-12-11', time: '14:00-16:00', status: 'pending', checkedIn: false },
  { id: '3', name: 'Study Room B-201', capacity: 4, building: 'Building B', bookedBy: 'Omar Ali', date: '2024-12-11', time: '09:00-11:00', status: 'active', checkedIn: false },
  { id: '4', name: 'Study Room C-105', capacity: 10, building: 'Building C', bookedBy: 'Fatma Khaled', date: '2024-12-10', time: '15:00-17:00', status: 'completed', checkedIn: true },
  { id: '5', name: 'Study Room B-105', capacity: 6, building: 'Building B', bookedBy: 'Nour Ahmed', date: '2024-12-12', time: '11:00-13:00', status: 'pending', checkedIn: false },
  { id: '6', name: 'Study Room A-205', capacity: 12, building: 'Building A', bookedBy: 'Laila Mahmoud', date: '2024-12-12', time: '08:00-10:00', status: 'active', checkedIn: true },
];

const Facilities = () => {
  const { t } = useTranslation();
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(mockStudyRooms);

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

  const handleCheckIn = (room: StudyRoom) => {
    setStudyRooms(prev => prev.map(r => r.id === room.id ? { ...r, checkedIn: true } : r));
    toast.success(`Checked in to ${room.name}`);
  };

  const handleCheckOut = (room: StudyRoom) => {
    setStudyRooms(prev => prev.map(r => r.id === room.id ? { ...r, checkedIn: false, status: 'completed' as const } : r));
    toast.success(`Checked out from ${room.name}`);
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

  const activeRooms = studyRooms.filter(r => r.status === 'active').length;
  const pendingRooms = studyRooms.filter(r => r.status === 'pending').length;
  const checkedInCount = studyRooms.filter(r => r.checkedIn).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('facilities_management')}</h1>
          <p className="page-subtitle">Manage study rooms and room reservations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          New Reservation
        </Button>
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
                <p className="text-2xl font-bold">{activeRooms}</p>
                <p className="text-sm text-muted-foreground">Active Study Rooms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{pendingRooms}</p>
                <p className="text-sm text-muted-foreground">Pending Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{checkedInCount}</p>
                <p className="text-sm text-muted-foreground">Checked In</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={studyRooms}
        columns={studyRoomColumns}
        actions={renderStudyRoomActions}
        searchPlaceholder="Search study rooms..."
      />
    </div>
  );
};

export default Facilities;
