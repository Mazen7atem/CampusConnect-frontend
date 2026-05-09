import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGetFacilitiesUsageQuery } from '@/entities/dashboard';

// ─── Color Palette (Corporate Modern) ───────────────────────────────
const COLORS = ['#002045', '#ffc250', '#2e7d6e'];

// ─── Custom Tooltip ──────────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { type: string } }>;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-campus-surface px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-campus-on-surface-variant">
        {payload[0].payload.type}
      </p>
      <p className="text-sm font-bold text-campus-primary">{payload[0].value}%</p>
    </div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────
const ChartSkeleton = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="h-40 w-40 animate-pulse rounded-full border-[20px] border-slate-200" />
    <div className="mt-6 space-y-2 w-full px-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Usage Chart Widget ──────────────────────────────────────────────
export const UsageChartWidget = () => {
  const { data: usage, isLoading } = useGetFacilitiesUsageQuery();

  return (
    <div className="rounded-lg border border-slate-200 bg-campus-surface shadow-sm h-full">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-semibold text-campus-primary">
          Facilities Usage
        </h3>
        <p className="text-sm text-campus-on-surface-variant mt-0.5">
          Breakdown by facility type
        </p>
      </div>

      {/* Chart */}
      <div className="p-4">
        {isLoading || !usage ? (
          <ChartSkeleton />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={usage}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="type"
                  stroke="none"
                >
                  {usage.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 space-y-2.5 px-2">
              {usage.map((entry, index) => (
                <div
                  key={entry.type}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="text-sm text-campus-on-surface-variant">
                      {entry.type}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-campus-primary">
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
