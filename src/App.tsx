import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminGuard } from '@/features/auth';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { LoginPage } from '@/pages/auth';
import { AnalyticsDashboardPage } from '@/pages/dashboard';
import { EventsQueuePage } from '@/pages/events';
import { UserManagementPage } from '@/pages/users';
import { ClubManagementPage } from '@/pages/clubs';
import { RoomManagementPage } from '@/pages/rooms';
import { FacilityManagementPage } from '@/pages/facilities';
import { ReportsPage } from '@/pages/reports';
import { LogsPage } from '@/pages/logs';

// ─── App Routes ──────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes — require admin or sudo role */}
      <Route element={<AdminGuard />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<AnalyticsDashboardPage />} />
          <Route path="/dashboard" element={<AnalyticsDashboardPage />} />
          <Route path="/events-queue" element={<EventsQueuePage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/clubs" element={<ClubManagementPage />} />
          <Route path="/rooms" element={<RoomManagementPage />} />
          <Route path="/facilities" element={<FacilityManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
