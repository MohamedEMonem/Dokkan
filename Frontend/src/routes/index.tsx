import { Routes, Route } from "react-router-dom";
import HomeLayout from "@/layout/HomeLayout";
import AuthLayout from "@/layout/AuthLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import AdminLayout from "@/layout/AdminLayout";


import ProtectedRoutes from "./ProtectedRoutes";
import ErrorPage from "@/pages/ErrorPage";

import { LoginForm } from "@/features/auth/Login";
import { RegisterForm } from "@/features/auth/Register";

import Landing from "@/pages/Landing";
import Profile from "@/pages/Profile";

import { ViewProducts } from "@/features/products/ViewProducts";
import { ProductDetailsPage } from "@/features/products/ProductDetailsPage";

import { Overview } from "@/features/dashboard/Overview";
import { AdminOverview } from "@/features/admin/Overview";
import { Products } from "@/features/dashboard/Products";
import { CreateProduct } from "@/features/dashboard/CreateProduct";
import { UpdateProduct } from "@/features/dashboard/UpdateProduct";
import { Settings } from "@/features/dashboard/Settings";
import { Customize } from "@/features/dashboard/Customize";
import ViewStores from "@/features/stores/ViewStores";
import StoreOnboarding from "@/features/stores/StoreOnboarding";
import WelcomeStep from "@/features/stores/Components/onboarding/WelcomeStep";
import SuccessStep from "@/features/stores/Components/onboarding/SuccessStep";
import StoreHome from "@/features/stores/StoreHome";
import StoreProducts from "@/features/stores/StoreProducts";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Landing />} />
        <Route path="/products" element={<ViewProducts />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/stores" element={<ViewStores />} />
        <Route path="/:subdomain" element={<StoreHome />} />
        <Route path="/:subdomain/products" element={<StoreProducts />} />
        <Route path="/:subdomain/products/:id" element={<ProductDetailsPage />} />
        {/* <Route path="/store/:id" element={<ViewStores />} /> */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoutes />}>
        {/* Dashboard Routes */}
        <Route path="/store/onboarding/welcome" element={<WelcomeStep />} />
        <Route path="/store/onboarding/steps" element={<StoreOnboarding />} />
        <Route path="/store/onboarding/success" element={<SuccessStep />} />
        <Route path="/dashboard/customize" element={<Customize />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/:id/edit" element={<UpdateProduct />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="stores" element={<div className="p-6 bg-white rounded-xl border border-accent-light shadow-sm text-text-dark font-bold text-lg">إدارة المتاجر - قيد التطوير</div>} />
          <Route path="products" element={<div className="p-6 bg-white rounded-xl border border-accent-light shadow-sm text-text-dark font-bold text-lg">إدارة المنتجات العامة - قيد التطوير</div>} />
          <Route path="reviews" element={<div className="p-6 bg-white rounded-xl border border-accent-light shadow-sm text-text-dark font-bold text-lg">مراجعة التعليقات والتقييمات - قيد التطوير</div>} />
          <Route path="flags" element={<div className="p-6 bg-white rounded-xl border border-accent-light shadow-sm text-text-dark font-bold text-lg">إدارة طلبات الإبلاغ - قيد التطوير</div>} />
          <Route path="categories" element={<div className="p-6 bg-white rounded-xl border border-accent-light shadow-sm text-text-dark font-bold text-lg">إدارة التصنيفات - قيد التطوير</div>} />
          <Route path="plans" element={<div className="p-6 bg-white rounded-xl border border-accent-light shadow-sm text-text-dark font-bold text-lg">خطط الاشتراك - قيد التطوير</div>} />
          <Route path="users" element={<div className="p-6 bg-white rounded-xl border border-accent-light shadow-sm text-text-dark font-bold text-lg">إدارة حسابات المستخدمين - قيد التطوير</div>} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
