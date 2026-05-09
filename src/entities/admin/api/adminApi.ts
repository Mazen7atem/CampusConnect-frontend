import { baseApi } from '@/shared/api';

// ─── Types ───────────────────────────────────────────────────────────
export interface Report {
  student_id: number;
  report_id: number;
  report_type: 'club' | 'event' | 'room' | 'facility';
  status: string;
  details: string;
  reason: string;
  /** Backend maps as created_at, but DB columns vary: 'date' or 'report_date' */
  created_at?: string;
  date?: string;
  report_date?: string;
}

export interface LogEntry {
  ip_address: string;
  user_type: string;
  record_id: string;
  edited_table: string;
  action: string;
  changed_by: string;
  time: string;
}

// ─── Injected Endpoints ──────────────────────────────────────────────
const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/admin/report */
    getReports: builder.query<Report[], void>({
      query: () => 'api/admin/report',
      providesTags: ['Report'],
    }),

    /** GET /api/admin/logs */
    getLogs: builder.query<LogEntry[], void>({
      query: () => 'api/admin/logs',
      providesTags: ['Log'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetLogsQuery,
} = adminApi;
