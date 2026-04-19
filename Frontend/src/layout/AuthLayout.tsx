import { Store } from "lucide-react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { EUserRole } from "@/types/entities/user.types";

export default function AuthLayout() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If already authenticated, redirect to home page
  if (token && role) {
    return <Navigate to={role === EUserRole.Customer ? "/" : "/dashboard"} replace />;
  }

  return (
    <main className="flex-1">
      <div className="min-h-screen py-12 justify-center items-center bg-linear-to-br from-bg-cream via-bg-cream to-accent-light">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <Store className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl text-primary">دكان</span>
          </Link>
          {/* Form outlet */}
          <Outlet />
        </div>
      </div>
    </main>
  );
}
