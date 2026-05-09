import {
  Users,
  ShieldCheck,
  CalendarClock,
  Zap,
  DoorOpen,
  Dumbbell,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useGetAdminStatsQuery } from '@/entities/dashboard';
import type { DashboardStats } from '@/entities/dashboard';

// ─── Card Config ─────────────────────────────────────────────────────
const cardConfig = [
  {
    key: 'total_students' as keyof DashboardStats,
    label: 'Total Students',
    icon: Users,
    trend: '+12%',
    trendUp: true,
    trendLabel: 'vs last month',
  },
  {
    key: 'active_clubs' as keyof DashboardStats,
    label: 'Active Clubs',
    icon: ShieldCheck,
    trend: '+3',
    trendUp: true,
    trendLabel: 'new this semester',
  },
  {
    key: 'active_events' as keyof DashboardStats,
    label: 'Active Events',
    icon: CalendarClock,
    trend: '+5',
    trendUp: true,
    trendLabel: 'this week',
  },
  {
    key: 'active_sessions' as keyof DashboardStats,
    label: 'Active Sessions',
    icon: Zap,
    trend: '+2',
    trendUp: true,
    trendLabel: 'today',
  },
  {
    key: 'reserved_rooms' as keyof DashboardStats,
    label: 'Reserved Rooms',
    icon: DoorOpen,
    trend: '-5',
    trendUp: false,
    trendLabel: 'from last week',
  },
  {
    key: 'reserved_facilities' as keyof DashboardStats,
    label: 'Reserved Facilities',
    icon: Dumbbell,
    trend: '+1',
    trendUp: true,
    trendLabel: 'today',
  },
];

// ─── Skeleton Card ───────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-lg border border-slate-200 bg-campus-surface p-6 shadow-sm animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-3 flex-1">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-8 w-16 rounded bg-slate-200" />
        <div className="h-3 w-32 rounded bg-slate-100" />
      </div>
      <div className="h-12 w-12 rounded-lg bg-slate-100" />
    </div>
  </div>
);

// ─── Dashboard Stats Widget ─────────────────────────────────────────
export const DashboardStatsWidget = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cardConfig.map(
        ({ key, label, icon: Icon, trend, trendUp, trendLabel }) => (
          <div
            key={key}
            className="group rounded-lg border border-slate-200 bg-campus-surface p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-campus-on-surface-variant uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-2xl font-bold tracking-tight text-campus-primary">
                  {(stats[key] ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffc250]/15 transition-transform duration-200 group-hover:scale-110">
                <Icon className="h-5 w-5 text-campus-gold" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              {trendUp ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-semibold ${
                  trendUp ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {trend}
              </span>
              <span className="text-xs text-campus-on-surface-variant">
                {trendLabel}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};
