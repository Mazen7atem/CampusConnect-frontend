import { useState } from 'react';
import { Send, Mail, Bell, History, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from '@/components/common/DataTable';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface NotificationHistory {
  id: string;
  subject: string;
  recipients: string;
  type: 'notification' | 'email';
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
}

const notificationHistory: NotificationHistory[] = [
  { id: '1', subject: 'Event Reminder: Tech Talk 2024', recipients: 'All Students', type: 'notification', sentAt: '2024-12-11 10:00', status: 'sent' },
  { id: '2', subject: 'Study Room Booking Confirmation', recipients: 'Ahmed Hassan', type: 'email', sentAt: '2024-12-11 09:30', status: 'sent' },
  { id: '3', subject: 'Club Session Cancelled', recipients: 'Tech Club Members', type: 'notification', sentAt: '2024-12-10 15:00', status: 'sent' },
  { id: '4', subject: 'New Event Announcement', recipients: 'All Students', type: 'email', sentAt: '2024-12-10 12:00', status: 'sent' },
  { id: '5', subject: 'Gym Reservation Approved', recipients: 'Sports Club', type: 'notification', sentAt: '2024-12-10 11:00', status: 'sent' },
  { id: '6', subject: 'Weekly Newsletter', recipients: 'All Students', type: 'email', sentAt: '2024-12-09 08:00', status: 'failed' },
];

const Notifications = () => {
  const { t } = useTranslation();
  const [recipientType, setRecipientType] = useState('all');
  const [notificationType, setNotificationType] = useState<'notification' | 'email'>('notification');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    
    toast.success(`${notificationType === 'email' ? 'Email' : 'Notification'} sent successfully!`);
    setSubject('');
    setMessage('');
  };

  const historyColumns = [
    { key: 'subject', header: t('subject') },
    { key: 'recipients', header: t('recipients') },
    { 
      key: 'type', 
      header: 'Type',
      render: (item: NotificationHistory) => (
        <Badge variant="outline" className={item.type === 'email' ? 'border-primary/30 text-primary' : ''}>
          {item.type === 'email' ? <Mail className="w-3 h-3 mr-1" /> : <Bell className="w-3 h-3 mr-1" />}
          {item.type}
        </Badge>
      )
    },
    { key: 'sentAt', header: t('sent_at') },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: NotificationHistory) => (
        <span className={
          item.status === 'sent' ? 'text-success font-medium' : 
          item.status === 'failed' ? 'text-destructive font-medium' : 
          'text-warning font-medium'
        }>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('notifications_emails')}</h1>
          <p className="page-subtitle">Send notifications and emails to students and clubs</p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="compose" className="gap-2">
            <Send className="w-4 h-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            {t('notification_history')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compose Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>Send a notification or email to your audience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type Selection */}
                <div className="space-y-3">
                  <Label>Message Type</Label>
                  <RadioGroup
                    value={notificationType}
                    onValueChange={(value) => setNotificationType(value as 'notification' | 'email')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="notification" id="notification" />
                      <Label htmlFor="notification" className="flex items-center gap-2 cursor-pointer">
                        <Bell className="w-4 h-4" /> Push Notification
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                        <Mail className="w-4 h-4" /> Email
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Recipients */}
                <div className="space-y-3">
                  <Label>Recipients</Label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="club">Specific Club</SelectItem>
                      <SelectItem value="event">Event Attendees</SelectItem>
                      <SelectItem value="faculty">By Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recipientType === 'club' && (
                  <div className="space-y-3">
                    <Label>Select Club</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a club" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tech Club</SelectItem>
                        <SelectItem value="ai">AI Club</SelectItem>
                        <SelectItem value="sports">Sports Club</SelectItem>
                        <SelectItem value="cultural">Cultural Club</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {recipientType === 'event' && (
                  <div className="space-y-3">
                    <Label>Select Event</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech-talk">Tech Talk 2024</SelectItem>
                        <SelectItem value="career-fair">Career Fair</SelectItem>
                        <SelectItem value="hackathon">Hackathon 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-3">
                  <Label htmlFor="subject">{t('subject')}</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject"
                  />
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <Label htmlFor="message">{t('message')}</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={6}
                  />
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleSend}
                  disabled={isSending}
                >
                  {isSending ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send {notificationType === 'email' ? 'Email' : 'Notification'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">1,234</p>
                      <p className="text-sm text-muted-foreground">Notifications Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">856</p>
                      <p className="text-sm text-muted-foreground">Emails Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-sm text-muted-foreground">Delivery Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <DataTable
            data={notificationHistory}
            columns={historyColumns}
            searchPlaceholder="Search notifications..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
