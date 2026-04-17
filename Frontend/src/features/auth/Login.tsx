import { Link } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock } from "lucide-react";

export const LoginForm = (): React.JSX.Element => {
  return (
    <AuthCard title="تسجيل الدخول" subtitle="أهلاً بك مجدداً في دكان">
      <form className="space-y-6">
        <div className="space-y-4">
          <Input
            label="البريد الإلكتروني"
            id="email"
            type="email"
            placeholder="البريد@الإلكتروني.com"
            icon={<Mail className="w-5 h-5" />}
            required
          />

          <div>
            <Input
              label="كلمة المرور"
              id="password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="rounded border-accent-light accent-primary w-4 h-4"
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

        <Button
          type="submit"
          variant="primary"
          className="py-6 rounded-xl h-9! text-lg w-full"
        >
          تسجيل الدخول
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
