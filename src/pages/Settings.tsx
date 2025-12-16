import { useState } from 'react';
import { Save, User, Lock, Building, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('profile_settings')}</h1>
          <p className="page-subtitle">Manage your profile and system settings</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            {t('personal_info')}
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="w-4 h-4" />
            {t('change_password')}
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Building className="w-4 h-4" />
            {t('system_settings')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('personal_info')}</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={user?.username} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={user?.role.replace('_', ' ')} disabled className="bg-muted" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : t('save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{t('change_password')}</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" />
              </div>

              <Button onClick={() => toast.success('Password updated successfully!')}>
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('add_faculty')}</CardTitle>
                <CardDescription>Add new faculties to the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Faculty name" className="flex-1" />
                  <Button>Add Faculty</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Engineering', 'Business', 'Science', 'Arts', 'Medicine'].map((faculty) => (
                    <div key={faculty} className="px-3 py-1 rounded-full bg-muted text-sm">
                      {faculty}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('manage_roles')}</CardTitle>
                <CardDescription>Manage admin roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { role: 'System Admin', desc: 'Full access to all systems', icon: Shield },
                    { role: 'Event & Room Admin', desc: 'Manage events, sessions, and study rooms', icon: Building },
                    { role: 'Sports Admin', desc: 'Manage sports facilities and reservations', icon: User },
                  ].map((item) => (
                    <div key={item.role} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.role}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: 'Email notifications', desc: 'Receive email notifications for important updates' },
                { label: 'Push notifications', desc: 'Receive push notifications in your browser' },
                { label: 'Event reminders', desc: 'Get reminded about upcoming events' },
                { label: 'Booking confirmations', desc: 'Receive confirmations for facility bookings' },
                { label: 'Weekly reports', desc: 'Receive weekly summary reports' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={index < 3} />
                </div>
              ))}

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
