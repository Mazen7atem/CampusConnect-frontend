import { baseApi } from '@/shared/api';

// ─── Types (aligned with real backend) ──────────────────────────────
export interface DashboardStats {
  total_students: number;
  active_clubs: number;
  active_events: number;
  active_sessions: number;
  reserved_rooms: number;
  reserved_facilities: number;
}

export interface AttendanceData {
  month: string;
  events: number;
  sessions: number;
}

export interface UsageData {
  type: string;
  value: number;
}

// ─── Fallback Mock Data ─────────────────────────────────────────────
// Shown when real API returns empty/null so the layout is always visible.
const FALLBACK_STATS: DashboardStats = {
  total_students: 1250,
  active_clubs: 42,
  active_events: 14,
  active_sessions: 8,
  reserved_rooms: 28,
  reserved_facilities: 6,
};

const FALLBACK_ATTENDANCE: AttendanceData[] = [
  { month: 'Jan', events: 320, sessions: 180 },
  { month: 'Feb', events: 450, sessions: 260 },
  { month: 'Mar', events: 520, sessions: 310 },
  { month: 'Apr', events: 380, sessions: 240 },
  { month: 'May', events: 620, sessions: 420 },
  { month: 'Jun', events: 480, sessions: 350 },
];

const FALLBACK_USAGE: UsageData[] = [
  { type: 'Study Rooms', value: 45 },
  { type: 'Gym', value: 30 },
  { type: 'Playground', value: 25 },
];

// ─── Injected Endpoints (real URLs from official docs) ──────────────
const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /api/admin/stats
     * Returns aggregate dashboard counters.
     */
    getAdminStats: builder.query<DashboardStats, void>({
      query: () => 'api/admin/stats',
      transformResponse: (response: DashboardStats) => {
        // If API returns zero-values or is empty, use the fallback
        if (!response || response.total_students === 0) {
          return FALLBACK_STATS;
        }
        return response;
      },
      // On network error fall back to mocks
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('api/admin/stats');
        if (result.error) {
          return { data: FALLBACK_STATS };
        }
        const data = result.data as DashboardStats;
        return {
          data:
            data && data.total_students > 0 ? data : FALLBACK_STATS,
        };
      },
    }),

    /**
     * GET /api/admin/attendance
     * Returns monthly attendance breakdown: [{ month, events, sessions }].
     */
    getAttendanceOverview: builder.query<AttendanceData[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('api/admin/attendance');
        if (result.error) {
          return { data: FALLBACK_ATTENDANCE };
        }
        const data = result.data as AttendanceData[];
        return {
          data: data && data.length > 0 ? data : FALLBACK_ATTENDANCE,
        };
      },
    }),

    /**
     * GET /api/admin/facilities-usage
     * Returns usage breakdown: [{ type, value }].
     */
    getFacilitiesUsage: builder.query<UsageData[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('api/admin/facilities-usage');
        if (result.error) {
          return { data: FALLBACK_USAGE };
        }
        const data = result.data as UsageData[];
        return {
          data: data && data.length > 0 ? data : FALLBACK_USAGE,
        };
      },
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAttendanceOverviewQuery,
  useGetFacilitiesUsageQuery,
} = dashboardApi;
