import { Users, Calendar, BookOpen, Building2, Dumbbell, Clock, Plus, CheckCircle, Bell, ArrowUpRight } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickAction } from '@/components/dashboard/QuickAction';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';

const attendanceData = [
  { name: 'Mon', events: 120, sessions: 80 },
  { name: 'Tue', events: 150, sessions: 95 },
  { name: 'Wed', events: 180, sessions: 120 },
  { name: 'Thu', events: 140, sessions: 88 },
  { name: 'Fri', events: 200, sessions: 150 },
  { name: 'Sat', events: 80, sessions: 45 },
  { name: 'Sun', events: 60, sessions: 30 },
];

const facilityData = [
  { name: 'Study Rooms', value: 45, color: 'hsl(356, 92%, 45%)' },
  { name: 'Gym', value: 30, color: 'hsl(0, 0%, 20%)' },
  { name: 'Playgrounds', value: 25, color: 'hsl(356, 70%, 60%)' },
];

const recentActivity = [
  { id: 1, action: 'New event created', item: 'Tech Talk 2024', time: '5 min ago', type: 'event' },
  { id: 2, action: 'Room reserved', item: 'Study Room A-101', time: '15 min ago', type: 'room' },
  { id: 3, action: 'Student registered', item: 'Ahmed Hassan', time: '1 hour ago', type: 'student' },
  { id: 4, action: 'Event approved', item: 'Career Fair', time: '2 hours ago', type: 'event' },
  { id: 5, action: 'Session scheduled', item: 'AI Workshop', time: '3 hours ago', type: 'session' },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  const stats = [
    { title: t('total_students'), value: '1,234', change: '+12% from last month', changeType: 'positive' as const, icon: Users },
    { title: t('active_clubs'), value: '48', change: '+3 new this semester', changeType: 'positive' as const, icon: Dumbbell },
    { title: t('active_events'), value: '15', change: '5 pending approval', changeType: 'neutral' as const, icon: Calendar },
    { title: t('reserved_rooms'), value: '28', change: '85% occupancy', changeType: 'neutral' as const, icon: Building2 },
    { title: t('reserved_facilities'), value: '12', change: '+8% from last week', changeType: 'positive' as const, icon: BookOpen },
    { title: t('active_sessions'), value: '8', change: '3 today', changeType: 'neutral' as const, icon: Clock },
  ];

  const quickActions = [
    { label: t('create_event'), icon: Plus, permission: ['system_admin', 'event_room_admin'] as const },
    { label: t('approve_event'), icon: CheckCircle, permission: ['system_admin', 'event_room_admin'] as const },
    { label: t('reserve_room'), icon: Building2, permission: ['system_admin', 'event_room_admin', 'sports_admin'] as const },
    { label: t('send_notification'), icon: Bell, permission: ['system_admin', 'event_room_admin', 'sports_admin'] as const },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('dashboard')}</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t('create_event')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="card-grid">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t('attendance_overview')}</CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="events" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Events" />
                  <Bar dataKey="sessions" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Facility Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('facility_usage')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={facilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {facilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {facilityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('quick_actions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions
                .filter((action) => hasPermission([...action.permission]))
                .map((action) => (
                  <QuickAction key={action.label} {...action} />
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t('recent_activity')}</CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {activity.type === 'event' && <Calendar className="w-5 h-5 text-primary" />}
                    {activity.type === 'room' && <Building2 className="w-5 h-5 text-primary" />}
                    {activity.type === 'student' && <Users className="w-5 h-5 text-primary" />}
                    {activity.type === 'session' && <BookOpen className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
