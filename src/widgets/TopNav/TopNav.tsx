import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/entities/session';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// ─── Route-to-Title Mapping ──────────────────────────────────────────
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/clubs': 'Clubs',
  '/rooms': 'Rooms',
  '/facilities': 'Facilities',
  '/events-queue': 'Events Queue',
  '/issues': 'Issues',
};

// ─── TopNav Component ────────────────────────────────────────────────
export const TopNav = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  // Get initials for avatar fallback
  const initials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : 'AD';

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : 'Admin';

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* ── Page Title ────────────────────────────── */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
        </div>

        {/* ── Right Actions ─────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Notifications placeholder */}
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
          </Button>

          <Separator orientation="vertical" className="h-8" />

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium leading-none">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {user?.role ?? 'admin'}
              </span>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>

      <Separator />
    </header>
  );
};
