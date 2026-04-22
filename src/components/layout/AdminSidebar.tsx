import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Building2, 
  BookOpen, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, AdminRole } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  path: string;
  permissions: AdminRole[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'nav_dashboard', path: '/dashboard', permissions: ['system_admin', 'event_room_admin', 'sports_admin'] },
  // Events Admin items
  { icon: Calendar, labelKey: 'nav_events', path: '/events', permissions: ['system_admin', 'event_room_admin'] },
  { icon: BookOpen, labelKey: 'nav_sessions', path: '/sessions', permissions: ['system_admin', 'event_room_admin'] },
  { icon: Building2, labelKey: 'nav_facilities', path: '/facilities', permissions: ['system_admin', 'event_room_admin'] },
  { icon: Dumbbell, labelKey: 'nav_clubs', path: '/clubs', permissions: ['system_admin', 'event_room_admin'] },
  // Sports Admin items
  { icon: Trophy, labelKey: 'nav_sports', path: '/sports', permissions: ['system_admin', 'sports_admin'] },
  // Shared items
  { icon: Users, labelKey: 'nav_students', path: '/students', permissions: ['system_admin', 'event_room_admin', 'sports_admin'] },
  { icon: FileText, labelKey: 'nav_reports', path: '/reports', permissions: ['system_admin', 'event_room_admin', 'sports_admin'] },
  { icon: Bell, labelKey: 'nav_notifications', path: '/notifications', permissions: ['system_admin', 'event_room_admin', 'sports_admin'] },
  { icon: Settings, labelKey: 'nav_settings', path: '/settings', permissions: ['system_admin'] },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(item => hasPermission(item.permissions));

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-40",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        "rtl:left-auto rtl:right-0 rtl:border-r-0 rtl:border-l"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">{t('app_name')}</h1>
              <p className="text-xs text-muted-foreground">{t('ejust')}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-link",
                isActive && "sidebar-link-active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? t(item.labelKey as any) : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{t(item.labelKey as any)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border bg-sidebar",
        collapsed && "px-2"
      )}>
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={logout}
            className={cn("text-muted-foreground hover:text-destructive", !collapsed && "flex-1")}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>{t('logout')}</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground shrink-0"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            ) : (
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};
