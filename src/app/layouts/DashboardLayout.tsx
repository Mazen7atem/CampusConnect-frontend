import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/widgets/Sidebar';
import { TopNav } from '@/widgets/TopNav';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Dashboard shell layout.
 * Renders: Sidebar (fixed left) | TopNav + scrollable content area (right).
 */
export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Fixed Sidebar ──────────────────────────── */}
      <Sidebar />

      {/* ── Main Content Area ──────────────────────── */}
      <div className="ml-64 flex flex-1 flex-col">
        <TopNav />

        <ScrollArea className="flex-1">
          <main className="p-6">
            <Outlet />
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};
