import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

export const AdminLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className={cn(
        "transition-all duration-300",
        "ml-64 rtl:ml-0 rtl:mr-64"
      )}>
        <TopBar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
