import { Routes, Route } from 'react-router-dom';
import HomeLayout from '@/layout/HomeLayout';
import AuthLayout from '@/layout/AuthLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import ProtectedRoutes from './ProtectedRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomeLayout />} />
      <Route path="/login" element={<AuthLayout />} />

      {/* Protected — store owner only */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Route>
    </Routes>
  );
}
