import { useState } from 'react';
import { Plus, MoreHorizontal, Ban, CheckCircle, Eye, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
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
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  faculty: string;
  club: string;
  status: 'active' | 'banned';
  reservations: number;
  complaints: number;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Ahmed Hassan', studentId: 'E2024001', email: 'ahmed@ejust.edu.eg', faculty: 'Engineering', club: 'Tech Club', status: 'active', reservations: 5, complaints: 0 },
  { id: '2', name: 'Sara Mohamed', studentId: 'E2024002', email: 'sara@ejust.edu.eg', faculty: 'Business', club: 'Marketing Club', status: 'active', reservations: 3, complaints: 1 },
  { id: '3', name: 'Omar Ali', studentId: 'E2024003', email: 'omar@ejust.edu.eg', faculty: 'Science', club: 'Research Club', status: 'banned', reservations: 0, complaints: 3 },
  { id: '4', name: 'Fatma Khaled', studentId: 'E2024004', email: 'fatma@ejust.edu.eg', faculty: 'Arts', club: 'Photography Club', status: 'active', reservations: 8, complaints: 0 },
  { id: '5', name: 'Youssef Ibrahim', studentId: 'E2024005', email: 'youssef@ejust.edu.eg', faculty: 'Engineering', club: 'AI Club', status: 'active', reservations: 12, complaints: 0 },
  { id: '6', name: 'Nour Ahmed', studentId: 'E2024006', email: 'nour@ejust.edu.eg', faculty: 'Medicine', club: 'Health Club', status: 'active', reservations: 2, complaints: 0 },
  { id: '7', name: 'Khaled Mostafa', studentId: 'E2024007', email: 'khaled@ejust.edu.eg', faculty: 'Engineering', club: 'Robotics Club', status: 'active', reservations: 6, complaints: 1 },
  { id: '8', name: 'Laila Mahmoud', studentId: 'E2024008', email: 'laila@ejust.edu.eg', faculty: 'Science', club: 'Environmental Club', status: 'active', reservations: 4, complaints: 0 },
];

const Students = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const columns = [
    { 
      key: 'name', 
      header: t('student_name'),
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>
      )
    },
    { key: 'studentId', header: t('student_id') },
    { key: 'faculty', header: t('student_faculty') },
    { key: 'club', header: t('student_club') },
    { key: 'reservations', header: 'Reservations' },
    { 
      key: 'complaints', 
      header: 'Complaints',
      render: (student: Student) => (
        <span className={student.complaints > 0 ? 'text-destructive font-medium' : ''}>
          {student.complaints}
        </span>
      )
    },
    { 
      key: 'status', 
      header: t('event_status'),
      render: (student: Student) => <StatusBadge status={student.status} />
    },
  ];

  const handleBan = (student: Student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: 'banned' as const } : s));
    toast.error(`${student.name} has been banned.`);
  };

  const handleUnban = (student: Student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: 'active' as const } : s));
    toast.success(`${student.name} has been unbanned.`);
  };

  const renderActions = (student: Student) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { setSelectedStudent(student); setViewDialogOpen(true); }}>
          <Eye className="w-4 h-4 mr-2" /> {t('view')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="w-4 h-4 mr-2" /> {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Eye className="w-4 h-4 mr-2" /> {t('view_reservations')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageSquare className="w-4 h-4 mr-2" /> {t('view_complaints')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {student.status === 'active' ? (
          <DropdownMenuItem onClick={() => handleBan(student)} className="text-destructive">
            <Ban className="w-4 h-4 mr-2" /> {t('ban_student')}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleUnban(student)} className="text-success">
            <CheckCircle className="w-4 h-4 mr-2" /> {t('unban_student')}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" /> {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('students_management')}</h1>
          <p className="page-subtitle">Manage student accounts and permissions</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          Add Student
        </Button>
      </div>

      <DataTable
        data={students}
        columns={columns}
        actions={renderActions}
        searchPlaceholder="Search by name, ID, or email..."
      />

      {/* Create Student Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Add a new student to the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="First name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Last name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" placeholder="E2024XXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@ejust.edu.eg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Input id="faculty" placeholder="Select faculty" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="club">Club</Label>
                <Input id="club" placeholder="Select club (optional)" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={() => {
                toast.success('Student added successfully!');
                setCreateDialogOpen(false);
              }}>
                {t('add')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.studentId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Faculty</p>
                  <p className="font-medium">{selectedStudent.faculty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Club</p>
                  <p className="font-medium">{selectedStudent.club}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedStudent.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reservations</p>
                  <p className="font-medium">{selectedStudent.reservations}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Complaints</p>
                  <p className={`font-medium ${selectedStudent.complaints > 0 ? 'text-destructive' : ''}`}>
                    {selectedStudent.complaints}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
