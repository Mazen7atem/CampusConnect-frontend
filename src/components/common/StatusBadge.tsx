import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'pending' | 'active' | 'approved' | 'declined' | 'completed' | 'cancelled' | 'banned' | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusStyles: Record<StatusType, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  active: 'bg-success/10 text-success border-success/20',
  approved: 'bg-success/10 text-success border-success/20',
  declined: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-muted text-muted-foreground border-muted',
  cancelled: 'bg-muted text-muted-foreground border-muted',
  banned: 'bg-destructive/10 text-destructive border-destructive/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
};

const statusLabels: Record<StatusType, string> = {
  pending: 'Pending',
  active: 'Active',
  approved: 'Approved',
  declined: 'Declined',
  completed: 'Completed',
  cancelled: 'Cancelled',
  banned: 'Banned',
  inactive: 'Inactive',
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium', statusStyles[status])}
    >
      {label || statusLabels[status]}
    </Badge>
  );
};
