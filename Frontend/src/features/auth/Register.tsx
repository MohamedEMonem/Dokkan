import { useState } from "react";
import { Link } from "react-router-dom";

import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Mail, Lock } from "lucide-react";

interface Role {
  roleName: "Customer" | "StoreOwner";
  icon: string;
  title: string;
  description: string;
}

export const RegisterForm = (): React.JSX.Element => {
  const [role, setRole] = useState<Role["roleName"]>("Customer");

  const roles = [
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

  return (
    <AuthCard title="إنشاء حساب جديد" subtitle="انضم إلى سوقنا اليوم">
      <form className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-3">
            أريد أن:
          </label>
          <div className="grid grid-cols-2 gap-4">
            {roles.map((r) => (
              <div
                key={r.roleName}
                onClick={() => setRole(r.roleName)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all text-center ${
                  role === r.roleName
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
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <Input
            label="الاسم الكامل"
            id="name"
            type="text"
            placeholder="أدخل اسمك الكامل"
            icon={<User className="w-5 h-5" />}
            required
          />

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
            <p className="text-xs text-text-muted mt-1">6 أحرف على الأقل</p>
          </div>

          <Input
            label="تأكيد كلمة المرور"
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            required
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 rounded border-accent-light accent-primary"
          />
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
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="py-6 rounded-xl h-9! text-lg"
        >
          إنشاء الحساب
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-text-muted">
          لديك حساب بالفعل؟{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary-dark hover:underline"
          >
            سجّل دخولك
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};
