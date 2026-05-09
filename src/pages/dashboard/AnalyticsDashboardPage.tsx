import { useAppSelector } from '@/app/hooks';
import { DashboardStatsWidget } from '@/widgets/DashboardStats';
import { AttendanceChartWidget } from '@/widgets/AttendanceChart';
import { UsageChartWidget } from '@/widgets/UsageChart';

// ─── Analytics Dashboard Page ────────────────────────────────────────
export const AnalyticsDashboardPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  const greeting = getGreeting();
  const firstName = user?.first_name ?? 'Admin';

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {greeting}, {firstName}! 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening across campus today.
        </p>
      </div>

      {/* ── 12-Column Grid Layout ────────────────────── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Stats row — all 12 columns */}
        <div className="col-span-12">
          <DashboardStatsWidget />
        </div>

        {/* Attendance chart — 8 columns */}
        <div className="col-span-12 lg:col-span-8">
          <AttendanceChartWidget />
        </div>

        {/* Usage chart — 4 columns */}
        <div className="col-span-12 lg:col-span-4">
          <UsageChartWidget />
        </div>
      </div>
    </div>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
