import { useState, type FormEvent, type ReactNode } from "react";
import { Crown, Package, Sparkles, Check } from "lucide-react";
import clsx from "clsx";

import { useGetPlansQuery } from "@/api/plan.api";
import { showNotification } from "@/utils/showNotification";
import type { IPlan } from "@/types/entities/subscription.types";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../types";

type PlanType = "basic" | "plus" | "pro";

interface PlanConfig {
  type: PlanType;
  icon: ReactNode;
  bulletClass: string;
  features: string[];
}

const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  basic: {
    type: "basic",
    icon: <Package className="w-14 h-14 rounded-xl p-4 text-white shadow-lg bg-gradient-to-br from-[#6B7280] to-[#4B5563]" />,
    bulletClass: "bg-gradient-to-br from-[#6B7280] to-[#4B5563]",
    features: [
      "منتجات غير محدودة",
      "لوحة تحكم كاملة",
      "دعم فني أساسي",
      "بدون دفع إلكتروني",
    ],
  },
  plus: {
    type: "plus",
    icon: <Crown className="w-14 h-14 rounded-xl p-4 text-white shadow-lg bg-gradient-to-br from-[#005B7F] to-[#007AA3]" />,
    bulletClass: "bg-gradient-to-br from-[#005B7F] to-[#007AA3]",
    features: [
      "كل مميزات الباقة الأساسية",
      "الدفع الإلكتروني مفعل",
      "2 موظفين",
      "تحليلات متقدمة",
      "دعم فني أولوية",
    ],
  },
  pro: {
    type: "pro",
    icon: <Sparkles className="w-14 h-14 rounded-xl p-4 text-white shadow-lg bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]" />,
    bulletClass: "bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]",
    features: [
      "كل مميزات باقة بلس",
      "5 موظفين",
      "نطاق مخصص",
      "أدوات تسويق متقدمة",
      "تقارير شاملة",
      "دعم فني مخصص 24/7",
    ],
  },
};

interface PlanStepProps {
  initialData?: StoreOnboardingDraft["plan"];
  onNext: (plan: StoreOnboardingDraft["plan"]) => void;
  onBack: () => void;
}

export default function PlanStep({
  initialData,
  onNext,
  onBack,
}: PlanStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<Partial<IPlan>>(
    initialData?.planId ? { id: initialData.planId, name: initialData.name, price: initialData.price } : {}
  );
  const { data: plansResponse, isLoading } = useGetPlansQuery();
  const plans = plansResponse?.data?.plans ?? [];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPlan?.id) {
      showNotification({ message: "يرجى اختيار باقة للاستمرار", variant: "error" });
      return;
    }
    onNext({ 
      planId: selectedPlan.id, 
      name: selectedPlan.name, 
      price: selectedPlan.price,
      slug: selectedPlan.slug,
    });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted font-medium">جاري تحميل الباقات...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 items-stretch mb-8">
          {plans.map((plan) => {
            const configKey = (plan.slug?.toLowerCase() as PlanType) || "basic";
            const config = PLAN_CONFIGS[configKey] || PLAN_CONFIGS.basic;
            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                config={config}
                isSelected={plan.id === selectedPlan?.id}
                onSelect={() => setSelectedPlan(plan)}
              />
            );
          })}
        </div>
      )}

      <StepActions onBack={onBack} primaryLabel="التالي – بيانات الدفع" />
    </form>
  );
}

interface PlanCardProps {
  plan: IPlan;
  config: PlanConfig;
  isSelected: boolean;
  onSelect: () => void;
}

function PlanCard({
  plan,
  config,
  isSelected,
  onSelect,
}: PlanCardProps) {
  const { icon, bulletClass, features, type } = config;
  const isPopular = type === "plus";

  // Outer container classes based on selected status and plan tier
  const cardClasses = clsx(
    "relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer flex flex-col",
    isSelected
      ? "border-[#005B7F] shadow-2xl scale-105"
      : "border-[#EBD8B7] shadow-lg hover:shadow-xl hover:scale-102"
  );

  return (
    <div className={cardClasses} onClick={onSelect}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0">
          <div className="bg-gradient-to-l from-[#F59E0B] to-[#D97706] text-white text-center py-2 text-xs shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-3 h-3" />
              <span>الأكثر شعبية</span>
            </div>
          </div>
        </div>
      )}

      <div className={clsx("p-6 flex flex-col flex-grow", isPopular ? "pt-12" : "pt-6")}>
        <div className="flex justify-center mb-4">
          {icon}
        </div>

        <h3 className="text-2xl text-center text-[#2B2B2B] mb-2">{plan.name}</h3>

        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-black text-[#005B7F]">{plan.price}</span>
            <span className="text-lg text-[#6B6B6B]">ج.م</span>
          </div>
          <p className="text-xs text-[#6B6B6B] mt-1">شهرياً</p>
        </div>

        <ul className="space-y-3 mb-6 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <div className="mt-0.5">
                <div className={clsx(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                  bulletClass
                )}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <span className="text-sm text-[#2B2B2B] flex-1">{feature}</span>
            </li>
          ))}
        </ul>

        {isSelected ? (
          <div className="flex items-center justify-center gap-2 text-[#005B7F] py-2.5 font-bold mt-auto">
            <Check className="w-5 h-5" />
            <span className="text-sm">تم الاختيار</span>
          </div>
        ) : (
          <div className="h-10 mt-auto" />
        )}
      </div>
    </div>
  );
}
