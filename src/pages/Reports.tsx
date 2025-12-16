import { useState } from 'react';
import { Download, FileText, BarChart3, MessageSquare, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

interface FacilityLog {
  id: string;
  facility: string;
  user: string;
  action: string;
  date: string;
  time: string;
}

interface AttendanceReport {
  id: string;
  event: string;
  date: string;
  registered: number;
  attended: number;
  rate: string;
}

interface ComplaintReport {
  id: string;
  student: string;
  type: string;
  subject: string;
  date: string;
  status: string;
}

const facilityLogs: FacilityLog[] = [
  { id: '1', facility: 'Study Room A-101', user: 'Ahmed Hassan', action: 'Check-in', date: '2024-12-11', time: '10:00' },
  { id: '2', facility: 'Main Gym', user: 'Sports Club', action: 'Reservation', date: '2024-12-11', time: '08:00' },
  { id: '3', facility: 'Study Room B-201', user: 'Sara Mohamed', action: 'Check-out', date: '2024-12-11', time: '12:30' },
  { id: '4', facility: 'Basketball Court', user: 'Basketball Club', action: 'Reservation', date: '2024-12-11', time: '14:00' },
  { id: '5', facility: 'Study Room C-105', user: 'Omar Ali', action: 'Cancelled', date: '2024-12-11', time: '09:00' },
];

const attendanceReports: AttendanceReport[] = [
  { id: '1', event: 'Tech Talk 2024', date: '2024-12-10', registered: 150, attended: 132, rate: '88%' },
  { id: '2', event: 'Career Fair', date: '2024-12-08', registered: 500, attended: 478, rate: '96%' },
  { id: '3', event: 'AI Workshop', date: '2024-12-05', registered: 45, attended: 42, rate: '93%' },
  { id: '4', event: 'Cultural Night', date: '2024-11-25', registered: 300, attended: 285, rate: '95%' },
  { id: '5', event: 'Research Symposium', date: '2024-11-20', registered: 80, attended: 65, rate: '81%' },
];

const complaintReports: ComplaintReport[] = [
  { id: '1', student: 'Omar Ali', type: 'Facility', subject: 'Broken AC in Study Room', date: '2024-12-10', status: 'Pending' },
  { id: '2', student: 'Sara Mohamed', type: 'Event', subject: 'Event postponement without notice', date: '2024-12-09', status: 'Resolved' },
  { id: '3', student: 'Khaled Mostafa', type: 'Club', subject: 'Unfair treatment by club manager', date: '2024-12-08', status: 'Under Review' },
  { id: '4', student: 'Fatma Khaled', type: 'Facility', subject: 'Gym equipment maintenance', date: '2024-12-07', status: 'Resolved' },
];

const usageChartData = [
  { month: 'Jul', studyRooms: 450, gym: 320, playgrounds: 280 },
  { month: 'Aug', studyRooms: 380, gym: 290, playgrounds: 250 },
  { month: 'Sep', studyRooms: 520, gym: 400, playgrounds: 350 },
  { month: 'Oct', studyRooms: 580, gym: 450, playgrounds: 380 },
  { month: 'Nov', studyRooms: 620, gym: 480, playgrounds: 420 },
  { month: 'Dec', studyRooms: 540, gym: 420, playgrounds: 360 },
];

const attendanceChartData = [
  { week: 'Week 1', events: 85, sessions: 78 },
  { week: 'Week 2', events: 92, sessions: 88 },
  { week: 'Week 3', events: 88, sessions: 82 },
  { week: 'Week 4', events: 95, sessions: 91 },
];

const Reports = () => {
  const { t } = useTranslation();

  const handleExport = (type: 'csv' | 'pdf', report: string) => {
    toast.success(`${report} exported as ${type.toUpperCase()}`);
  };

  const facilityColumns = [
    { key: 'facility', header: 'Facility' },
    { key: 'user', header: 'User' },
    { key: 'action', header: 'Action' },
    { key: 'date', header: 'Date' },
    { key: 'time', header: 'Time' },
  ];

  const attendanceColumns = [
    { key: 'event', header: 'Event' },
    { key: 'date', header: 'Date' },
    { key: 'registered', header: 'Registered' },
    { key: 'attended', header: 'Attended' },
    { 
      key: 'rate', 
      header: 'Rate',
      render: (item: AttendanceReport) => (
        <span className={parseInt(item.rate) >= 90 ? 'text-success font-medium' : parseInt(item.rate) >= 80 ? 'text-warning font-medium' : 'text-destructive font-medium'}>
          {item.rate}
        </span>
      )
    },
  ];

  const complaintColumns = [
    { key: 'student', header: 'Student' },
    { key: 'type', header: 'Type' },
    { key: 'subject', header: 'Subject' },
    { key: 'date', header: 'Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: ComplaintReport) => (
        <span className={
          item.status === 'Resolved' ? 'text-success font-medium' : 
          item.status === 'Pending' ? 'text-warning font-medium' : 
          'text-primary font-medium'
        }>
          {item.status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('reports_logs')}</h1>
          <p className="page-subtitle">View and export detailed reports</p>
        </div>
      </div>

      <Tabs defaultValue="facility" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="facility" className="gap-2">
            <Building2 className="w-4 h-4" />
            {t('facility_logs')}
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            {t('attendance_reports')}
          </TabsTrigger>
          <TabsTrigger value="complaints" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('complaint_reports')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="facility" className="space-y-6">
          {/* Usage Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Facility Usage Trends</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('csv', 'Facility Logs')}>
                  <Download className="w-4 h-4 mr-2" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'Facility Logs')}>
                  <FileText className="w-4 h-4 mr-2" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="studyRooms" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Study Rooms" />
                    <Bar dataKey="gym" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Gym" />
                    <Bar dataKey="playgrounds" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Playgrounds" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <DataTable
            data={facilityLogs}
            columns={facilityColumns}
            searchPlaceholder="Search logs..."
          />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          {/* Attendance Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendance Rate (%)</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('csv', 'Attendance Reports')}>
                  <Download className="w-4 h-4 mr-2" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'Attendance Reports')}>
                  <FileText className="w-4 h-4 mr-2" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }} name="Events" />
                    <Line type="monotone" dataKey="sessions" stroke="hsl(var(--chart-3))" strokeWidth={3} dot={{ fill: 'hsl(var(--chart-3))' }} name="Sessions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <DataTable
            data={attendanceReports}
            columns={attendanceColumns}
            searchPlaceholder="Search events..."
          />
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv', 'Complaint Reports')}>
              <Download className="w-4 h-4 mr-2" /> {t('export_csv')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'Complaint Reports')}>
              <FileText className="w-4 h-4 mr-2" /> {t('export_pdf')}
            </Button>
          </div>

          <DataTable
            data={complaintReports}
            columns={complaintColumns}
            searchPlaceholder="Search complaints..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
