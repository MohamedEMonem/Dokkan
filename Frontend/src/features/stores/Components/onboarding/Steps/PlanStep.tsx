import { useState, type FormEvent } from "react";
import { Zap, Store, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

import { useGetPlansQuery } from "@/api/plan.api";
import { showNotification } from "@/utils/showNotification";
import type { IPlan } from "@/types/entities/subscription.types";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../types";

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
      price: selectedPlan.price 
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
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={plan.id === selectedPlan?.id}
              onSelect={() => setSelectedPlan(plan)}
            />
          ))}
        </div>
      )}

      <StepActions onBack={onBack} primaryLabel="التالي – بيانات الدفع" />
    </form>
  );
}

interface PlanCardProps {
  plan: IPlan;
  isSelected: boolean;
  onSelect: () => void;
}

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: PlanCardProps) {
  const isPopular = plan.name === "باقة بلس" || plan.name?.includes("Plus");

  const features = [
    "منتجات غير محدودة",
    "لوحة تحكم كاملة",
    "دعم فني أساسي",
    "بدون دفع إلكتروني",
  ];

  const plusFeatures = [
    "كل مميزات الباقة الأساسية",
    "الدفع الإلكتروني مفعل",
    "2 موظفين",
    "تحليلات متقدمة",
    "دعم فني أولوية",
  ];

  const proFeatures = [
    "كل مميزات باقة بلس",
    "5 موظفين",
    "نطاق مخصص",
    "أدوات تسويق متقدمة",
    "تقارير شاملة",
    "دعم فني مخصص 24/7",
  ];

  const displayFeatures = isPopular ? plusFeatures : (plan.price > 2000 ? proFeatures : features);

  return (
    <div className={clsx(
      "relative flex flex-col p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white group",
      isSelected 
        ? "border-primary shadow-xl shadow-primary/10 ring-4 ring-primary/5" 
        : "border-accent-light/40 hover:border-primary/40 hover:shadow-lg",
      isPopular && !isSelected && "border-orange-400"
    )} onClick={onSelect}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full z-10 flex items-center gap-1 shadow-sm">
          <Zap size={12} fill="currentColor" />
          الأكثر شعبية
        </div>
      )}

      <div className="flex flex-col items-center text-center space-y-4 mb-6">
        <div className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
          plan.price > 2000 ? "bg-purple-100 text-purple-600" : isPopular ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
        )}>
          {plan.price > 2000 ? <Zap size={24} /> : <Store size={24} />}
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-dark">{plan.name}</h3>
          <div className="flex items-baseline justify-center gap-1 mt-2">
            <span className="text-3xl font-black text-text-dark">{plan.price}</span>
            <span className="text-sm text-text-muted">ج.م/شهرياً</span>
          </div>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {displayFeatures.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
            <CheckCircle2 size={16} className={clsx("mt-0.5 shrink-0 uppercase", isSelected ? "text-primary" : "text-text-muted/60")} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className={clsx(
        "w-full py-3 rounded-2xl border-2 font-bold text-center transition-all",
        isSelected ? "bg-primary border-primary text-white" : "border-accent-light text-text-muted group-hover:border-primary group-hover:text-primary"
      )}>
        {isSelected ? "تم الاختيار" : "اختيار هذه الباقة"}
      </div>
    </div>
  );
}
