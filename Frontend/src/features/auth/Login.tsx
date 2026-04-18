import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock } from "lucide-react";

import { loginSchema, type LoginFormValues } from "./schemas/login.schema";
import { useLoginMutation } from "@/api/auth.api";
import { showNotification } from "@/utils/showNotification";

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */

export const LoginForm = (): React.JSX.Element => {
  const [loginApi] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginApi(data).unwrap();
      showNotification({ message: response.message, variant: "success" });
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "حدث خطأ غير متوقع";
      showNotification({ message: errorMessage, variant: "error" });
      console.error("Login error:", error);
    }
  };

  return (
    <AuthCard title="تسجيل الدخول" subtitle="أهلاً بك مجدداً في دكان">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <Input
              label="البريد الإلكتروني"
              id="email"
              type="email"
              placeholder="البريد@الإلكتروني.com"
              icon={<Mail className="w-5 h-5" />}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
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
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Remember Me + Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="rounded border-accent-light accent-primary w-4 h-4"
              {...register("rememberMe")}
            />
            <span className="text-sm text-text-muted group-hover:text-text-dark transition-colors">
              تذكرني
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:text-primary-dark hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="py-6 rounded-xl h-9! text-lg w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text-muted">
          ليس لديك حساب؟{" "}
          <Link
            to="/auth/register"
            className="text-primary hover:text-primary-dark hover:underline"
          >
            سجّل الآن
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};
