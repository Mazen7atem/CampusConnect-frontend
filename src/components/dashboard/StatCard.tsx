import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
}

export const StatCard = ({ title, value, change, changeType = 'neutral', icon: Icon, className, style }: StatCardProps) => {
  return (
    <div className={cn("stat-card group", className)} style={style}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "mt-1 text-sm font-medium",
              changeType === 'positive' && "text-success",
              changeType === 'negative' && "text-destructive",
              changeType === 'neutral' && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          "bg-primary/10 text-primary",
          "transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground"
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
