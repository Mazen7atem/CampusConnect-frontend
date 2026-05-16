import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetAttendanceOverviewQuery } from '@/entities/dashboard';

// ─── Custom Tooltip ──────────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-level-2">
      <p className="text-xs font-semibold text-primary mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-on-surface-variant capitalize">
            {entry.dataKey}:
          </span>
          <span className="text-xs font-bold text-primary">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────
const ChartSkeleton = () => (
  <div className="flex h-[320px] items-end gap-3 px-8 py-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex-1 flex gap-1">
        <div
          className="flex-1 animate-pulse rounded-t bg-surface-container-high"
          style={{ height: `${30 + Math.random() * 60}%` }}
        />
        <div
          className="flex-1 animate-pulse rounded-t bg-surface-container"
          style={{ height: `${20 + Math.random() * 50}%` }}
        />
      </div>
    ))}
  </div>
);

// ─── Attendance Chart Widget ─────────────────────────────────────────
export const AttendanceChartWidget = () => {
  const { data: attendance, isLoading } = useGetAttendanceOverviewQuery();

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest shadow-level-1 h-full">
      {/* Header */}
      <div className="border-b border-outline-variant px-6 py-4">
        <h3 className="text-base font-semibold text-primary">
          Attendance Overview
        </h3>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Monthly event and session participation
        </p>
      </div>

      {/* Chart */}
      <div className="p-4">
        {isLoading || !attendance ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={attendance}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#43474e' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 32, 69, 0.04)' }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              />
              <Bar
                dataKey="events"
                name="Events"
                fill="#002045"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="sessions"
                name="Sessions"
                fill="#ffc250"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
