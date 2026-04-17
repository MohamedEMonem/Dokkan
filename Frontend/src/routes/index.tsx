import { Routes, Route } from 'react-router-dom';
import HomeLayout from '@/layout/HomeLayout';
import AuthLayout from '@/layout/AuthLayout';
import DashboardLayout from '@/layout/DashboardLayout';

import ProtectedRoutes from './ProtectedRoutes';
import ErrorPage from '@/pages/ErrorPage';

import { LoginForm } from '@/features/auth/Login';
import { RegisterForm } from '@/features/auth/Register';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomeLayout />} />
      <Route path='/auth'  element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>

      {/* Protected — store owner only */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Route>
      {/* Catch-all */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
