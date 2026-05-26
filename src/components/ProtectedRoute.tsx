import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute wrapper for authenticated pages
 * - Redirects to /login if not authenticated
 * - Shows loading state while checking auth
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#0d1117]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#c6c6cd] dark:border-[#2e3347] border-t-[#0058be] rounded-full animate-spin" />
          <p className="text-[#45464d] dark:text-[#9aa3bf]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * PublicRoute wrapper for login/signup pages
 * - Redirects to /conversations if already authenticated
 * - Prevents authenticated users from accessing auth pages
 */
export function PublicRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#0d1117]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#c6c6cd] dark:border-[#2e3347] border-t-[#0058be] rounded-full animate-spin" />
          <p className="text-[#45464d] dark:text-[#9aa3bf]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/conversations" replace />;
  }

  return <>{children}</>;
}
