import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoutes() {
  // Check for the authentication token
  const token = localStorage.getItem('token'); 
  const role = localStorage.getItem('role');  

  if (!token || !role) {
    // Redirect to login page 
    return <Navigate to="/auth/login" replace />;
  }

  // Token exists, proceed to the protected route
  return <Outlet />;
}
