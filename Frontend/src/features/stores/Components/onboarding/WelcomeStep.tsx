import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  ArrowLeft,
  ArrowDown,
  User,
  Briefcase,
  CircleCheckBig,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/layout/Header/Header";

export default function WelcomeStep() {
  const navigate = useNavigate();
  const onNext = () => navigate("/store/onboarding/steps");

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-bg-cream via-bg-cream to-accent-light" dir="rtl">
      <Header />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
      {/* Upper stepper section in a card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-4xl text-gray-900 mb-4 font-bold">مرحباً بك في مركز البائعين - دكان</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            لنقم بإعداد ملفك الشخصي وإنشاء متجرك ببضع خطوات بسيطة.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 max-w-xl mx-auto mb-12 py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">المعلومات الشخصية</span>
          </div>

          <ArrowLeft className="hidden sm:block w-6 h-6 text-primary -mt-6" />
          <ArrowDown className="block sm:hidden w-6 h-6 text-primary" />

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">تفاصيل النشاط التجاري</span>
          </div>

          <ArrowLeft className="hidden sm:block w-6 h-6 text-primary -mt-6" />
          <ArrowDown className="block sm:hidden w-6 h-6 text-primary" />

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Store className="w-8 h-8 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">إعداد المتجر</span>
          </div>

          <ArrowLeft className="hidden sm:block w-6 h-6 text-primary -mt-6" />
          <ArrowDown className="block sm:hidden w-6 h-6 text-primary" />

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <CircleCheckBig className="w-8 h-8 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">تم</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-white hover:bg-primary/90 h-10 rounded-md px-8 w-full sm:w-auto cursor-pointer"
            onClick={onNext}
          >
            ابدأ الإعداد
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">يستغرق حوالي 5 دقائق • مطلوب لجميع البائعين</p>
      </div>

      {/* Lower features section */}
      <div className="grid md:grid-cols-3 gap-6 pt-12">
        <FeatureCard
          title="متجرك الخاص"
          description="احصل على صفحة متجر مخصصة بعلامتك التجارية"
          icon={<Store className="text-primary" />}
        />
        <FeatureCard
          title="إدارة سهلة"
          description="لوحة تحكم قوية لإدارة المنتجات والطلبات"
          icon={<LayoutDashboard className="text-primary" />}
        />
        <FeatureCard
          title="وصول محلي"
          description="بع للعملاء في جميع أنحاء مصر مع خيارات دفع محلية"
          icon={<ShieldCheck className="text-primary" />}
        />
      </div>
    </div>
    </div>
    </main>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-accent-light/40 shadow-sm text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h3 className="font-bold text-text-dark">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}
