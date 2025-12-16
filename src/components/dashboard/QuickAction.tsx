import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'primary';
}

export const QuickAction = ({ label, icon: Icon, onClick, variant = 'default' }: QuickActionProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-xl",
        "transition-all duration-200 ease-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        variant === 'default' && "bg-card border border-border hover:border-primary/30 hover:shadow-md",
        variant === 'primary' && "bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        variant === 'default' && "bg-primary/10 text-primary",
        variant === 'primary' && "bg-primary-foreground/20 text-primary-foreground"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <span className={cn(
        "text-sm font-medium",
        variant === 'default' && "text-foreground",
        variant === 'primary' && "text-primary-foreground"
      )}>
        {label}
      </span>
    </button>
  );
};
