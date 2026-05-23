import { Navigate, Outlet } from 'react-router-dom';
import { useGetProfileQuery } from '@/api/user.api';

export default function ProtectedRoutes() {
  // Check for the authentication token
  const token = localStorage.getItem('token'); 
  const { data: profileResponse, isLoading, isError } = useGetProfileQuery(undefined, { skip: !token });

  if (!token) {
    // Redirect to login page 
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-cream">
        <div className="text-lg font-bold text-text-dark">جاري التحميل...</div>
      </div>
    );
  }

  if (isError || !profileResponse?.data?.user) {
    localStorage.removeItem('token');
    return <Navigate to="/auth/login" replace />;
  }

  // Token and user exist, proceed to the protected route
  return <Outlet />;
}
