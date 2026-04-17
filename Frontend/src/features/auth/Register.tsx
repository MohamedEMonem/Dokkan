import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Mail, Lock } from "lucide-react";

/* ────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────── */

type RoleName = "Customer" | "StoreOwner";

interface Role {
  roleName: RoleName;
  icon: string;
  title: string;
  description: string;
}

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  role: RoleName;
}

/* ────────────────────────────────────────────────────────
 * Constants
 * ──────────────────────────────────────────────────────── */

const roles: readonly Role[] = [
  {
    roleName: "Customer",
    icon: "🛍️",
    title: "أشتري منتجات",
    description: "تسوق من المتاجر",
  },
  {
    roleName: "StoreOwner",
    icon: "🏪",
    title: "أبيع منتجات",
    description: "أنشئ متجراً",
  },
] as const;

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */

export const RegisterForm = (): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      role: "Customer",
    },
  });

  // Watch the current role value so the UI stays in sync
  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    // TODO: wire up to your API
    console.log("Register payload:", data);
  };

  return (
    <AuthCard title="إنشاء حساب جديد" subtitle="انضم إلى سوقنا اليوم">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-3">
            أريد أن:
          </label>
          <div className="grid grid-cols-2 gap-4">
            {roles.map((r) => (
              <div
                key={r.roleName}
                onClick={() => setValue("role", r.roleName)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all text-center ${
                  selectedRole === r.roleName
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-accent-light hover:border-accent"
                }`}
              >
                <div className="text-3xl mb-2">{r.icon}</div>
                <div className="text-text-dark font-medium">{r.title}</div>
                <div className="text-xs text-text-muted mt-1">
                  {r.description}
                </div>
              </div>
            ))}
          </div>
          {/* Hidden input so RHF tracks the role value */}
          <input type="hidden" {...register("role")} />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <Input
              label="الاسم الكامل"
              id="name"
              type="text"
              placeholder="أدخل اسمك الكامل"
              icon={<User className="w-5 h-5" />}
              {...register("name", {
                required: "الاسم مطلوب",
                minLength: { value: 2, message: "الاسم يجب أن يكون حرفين على الأقل" },
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Input
              label="البريد الإلكتروني"
              id="email"
              type="email"
              placeholder="البريد@الإلكتروني.com"
              icon={<Mail className="w-5 h-5" />}
              {...register("email", {
                required: "البريد الإلكتروني مطلوب",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "صيغة البريد الإلكتروني غير صحيحة",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Input
              label="كلمة المرور"
              id="password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              {...register("password", {
                required: "كلمة المرور مطلوبة",
                minLength: { value: 6, message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
              })}
            />
            {errors.password ? (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            ) : (
              <p className="text-xs text-text-muted mt-1">6 أحرف على الأقل</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Input
              label="تأكيد كلمة المرور"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              {...register("confirmPassword", {
                required: "تأكيد كلمة المرور مطلوب",
                validate: (value) =>
                  value === watch("password") || "كلمتا المرور غير متطابقتين",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 rounded border-accent-light accent-primary"
            {...register("terms", {
              required: "يجب الموافقة على الشروط والأحكام",
            })}
          />
          <div>
            <label htmlFor="terms" className="text-sm text-text-muted">
              أوافق على{" "}
              <Link to="/terms" className="text-primary hover:underline">
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                سياسة الخصوصية
              </Link>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="py-6 rounded-xl h-9! text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-text-muted">
          لديك حساب بالفعل؟{" "}
          <Link
            to="/auth/login"
            className="text-primary hover:text-primary-dark hover:underline"
          >
            سجّل دخولك
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};
