import { useState } from 'react';
import {
  AlertCircle,
  RefreshCw,
  FileWarning,
  Filter,
} from 'lucide-react';
import { useGetReportsQuery } from '@/entities/admin';
import type { Report } from '@/entities/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── Report Type Badge Variant ───────────────────────────────────────
const typeVariant: Record<Report['report_type'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  club: 'default',
  event: 'secondary',
  room: 'outline',
  facility: 'destructive',
};

// ─── Table Skeleton ──────────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4 animate-pulse">
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="ml-auto h-4 w-32 rounded bg-muted" />
      </div>
    ))}
  </div>
);

// ─── Reports Page ────────────────────────────────────────────────────
export const ReportsPage = () => {
  const { data: reports, isLoading, isError, refetch } = useGetReportsQuery();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = reports
    ? filterType === 'all'
      ? reports
      : reports.filter((r) => r.report_type === filterType)
    : [];

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View student-submitted reports for clubs, events, rooms, and facilities.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* ── Filter Bar ────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-1">Filter:</span>
        {['all', 'club', 'event', 'room', 'facility'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
              filterType === t
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-input hover:bg-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Loading ────────────────────────────────────── */}
      {isLoading && <TableSkeleton />}

      {/* ── Error ──────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <h3 className="text-lg font-semibold">Failed to load reports</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Could not fetch reports. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Data Table ─────────────────────────────────── */}
      {!isLoading && !isError && reports && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-card p-16 text-center">
              <FileWarning className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">No reports found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filterType === 'all' ? 'No reports have been submitted yet.' : `No ${filterType} reports found.`}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reason</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filtered.map((report, idx) => (
                      <tr key={`${report.report_type}-${report.report_id}-${idx}`} className="transition-colors hover:bg-muted/20">
                        <td className="px-4 py-3.5">
                          <Badge variant={typeVariant[report.report_type]} className="capitalize">
                            {report.report_type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium">{report.student_id}</td>
                        <td className="px-4 py-3.5 text-sm">{report.reason}</td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground max-w-xs truncate">{report.details}</td>
                        <td className="px-4 py-3.5 text-sm capitalize">{report.status ?? '—'}</td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground">
                          {(() => {
                            const dateVal = report.created_at || report.date || report.report_date;
                            return dateVal ? new Date(dateVal).toLocaleDateString() : '—';
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border/50 bg-muted/20 px-4 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filtered.length}</span> report{filtered.length !== 1 ? 's' : ''}
                  {filterType !== 'all' && ` (filtered by ${filterType})`}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
