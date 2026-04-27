import { Routes, Route } from 'react-router-dom';
import HomeLayout from '@/layout/HomeLayout';
import AuthLayout from '@/layout/AuthLayout';
import DashboardLayout from '@/layout/DashboardLayout';

import ProtectedRoutes from './ProtectedRoutes';
import ErrorPage from '@/pages/ErrorPage';

import { LoginForm } from '@/features/auth/Login';
import { RegisterForm } from '@/features/auth/Register';
import Profile from '@/pages/Profile';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomeLayout />} >
        <Route path='/profile' element={<Profile/>} />
      </Route>
      <Route path='/auth'  element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoutes />}>
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
