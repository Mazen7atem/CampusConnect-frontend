import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

/**
 * Route guard that restricts access to users with 'admin' or 'sudo' roles.
 *
 * Usage (in route config):
 * ```tsx
 * <Route element={<AdminGuard />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 * ```
 *
 * - No token  → redirect to /login
 * - Wrong role → redirect to /login
 * - Valid role → render nested routes via <Outlet />
 */
const ALLOWED_ROLES = ['admin', 'sudo'] as const;

export const AdminGuard = () => {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  // No token at all — not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but user profile hasn't loaded yet or role is insufficient
  if (!user || !ALLOWED_ROLES.includes(user.role as (typeof ALLOWED_ROLES)[number])) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
