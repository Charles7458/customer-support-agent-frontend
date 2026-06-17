import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth22';

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
  const location = useLocation()
  console.log("location: "+location.pathname)
  localStorage.setItem("lastPath",location.pathname)
  
  if(location.pathname.startsWith("/support-chat")){
    sessionStorage.setItem("last_support_chat",location.pathname)
  }

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
    const lastRoute = localStorage.getItem("lastPath")
    console.log("route in storage:"+lastRoute)
    return <Navigate to={lastRoute || '/conversations'} replace />;
  }

  return <>{children}</>;
}
