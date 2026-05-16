import { NavLink } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  DoorOpen,
  Building2,
  CalendarClock,
  AlertTriangle,
  LayoutDashboard,
  ScrollText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// ─── Navigation Items ────────────────────────────────────────────────
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'Clubs', icon: ShieldCheck, path: '/clubs' },
  { label: 'Rooms', icon: DoorOpen, path: '/rooms' },
  { label: 'Facilities', icon: Building2, path: '/facilities' },
  { label: 'Events Queue', icon: CalendarClock, path: '/events-queue' },
  { label: 'Reports', icon: AlertTriangle, path: '/reports' },
  { label: 'Activity Logs', icon: ScrollText, path: '/logs' },
] as const;

// ─── Sidebar Component ──────────────────────────────────────────────
export const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* ── Branding ─────────────────────────────────── */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-container font-bold text-secondary-container-fg text-sm">
          CC
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            CampusConnect
          </span>
          <span className="text-[11px] text-sidebar-foreground/60">
            EJUST Admin
          </span>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* ── Navigation ───────────────────────────────── */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/5 border-l-4 border-secondary-container text-white'
                    : 'border-l-4 border-transparent text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0 transition-colors',
                      isActive
                        ? 'text-secondary-container'
                        : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
                    )}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="border-t border-sidebar-border p-4">
        <p className="text-[11px] text-sidebar-foreground/40 text-center">
          © 2026 EJUST
        </p>
      </div>
    </aside>
  );
};
