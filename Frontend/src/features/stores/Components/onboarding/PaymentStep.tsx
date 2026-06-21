import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Shield, Crown, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../../schemas/draft.types";
import { paymentSchema, type PaymentFormValues } from "../../schemas/payment.schema";

interface PaymentStepProps {
  draft: StoreOnboardingDraft;
  onNext: (payment: StoreOnboardingDraft["payment"]) => void;
  onBack: () => void;
}

const PLAN_FEATURES: Record<string, string[]> = {
  basic: [
    "منتجات غير محدودة",
    "لوحة تحكم كاملة",
    "دعم فني أساسي",
    "بدون دفع إلكتروني",
  ],
  plus: [
    "كل مميزات الباقة الأساسية",
    "الدفع الإلكتروني مفعل",
    "2 موظفين",
    "تحليلات متقدمة",
    "دعم فني أولوية",
  ],
  pro: [
    "كل مميزات باقة بلس",
    "5 موظفين",
    "نطاق مخصص",
    "أدوات تسويق متقدمة",
    "تقارير شاملة",
    "دعم فني مخصص 24/7",
  ],
};

export default function PaymentStep({
  draft,
  onNext,
  onBack,
}: PaymentStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardholderName: draft.payment?.cardholderName ?? "",
      cardNumber: draft.payment?.cardNumber ?? "",
      expiry: draft.payment?.expiry ?? "",
      cvc: draft.payment?.cvc ?? "",
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    onNext(data);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g) || [];
    e.target.value = groups.join(" ").substring(0, 19);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.length > 2) {
      digits = digits.substring(0, 2) + "/" + digits.substring(2, 4);
    }
    e.target.value = digits.substring(0, 5);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    e.target.value = digits.substring(0, 3);
  };

  const planSlug = draft.plan?.slug?.toLowerCase() || "basic";
  const features = PLAN_FEATURES[planSlug] || PLAN_FEATURES.basic;
  const planName = draft.plan?.name || "الأساسية";
  const planPrice = draft.plan?.price || 999;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <StepSection>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card Details Section */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-lg flex items-center justify-center shadow-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl text-text-dark font-semibold">معلومات البطاقة</h2>
                <p className="text-xs text-text-muted">أدخل بيانات بطاقتك الائتمانية</p>
              </div>
            </div>

            <div>
              <Input
                label="اسم حامل البطاقة *"
                placeholder="أدخل الاسم كما هو مكتوب على البطاقة"
                className="h-12! border-accent-light! focus-within:border-primary! bg-white!"
                {...register("cardholderName")}
              />
              {errors.cardholderName && (
                <p className="text-xs text-red-500 mt-1">{errors.cardholderName.message}</p>
              )}
            </div>

            <div>
              <Input
                label="رقم البطاقة *"
                placeholder="1234 5678 9012 3456"
                icon={<CreditCard className="w-5 h-5 text-text-muted" />}
                className="h-12! border-accent-light! focus-within:border-primary! bg-white! flex-row-reverse!"
                {...register("cardNumber", { onChange: handleCardNumberChange })}
              />
              {errors.cardNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="تاريخ الانتهاء *"
                  placeholder="MM/YY"
                  className="h-12! border-accent-light! focus-within:border-primary! bg-white! text-center!"
                  {...register("expiry", { onChange: handleExpiryChange })}
                />
                {errors.expiry && (
                  <p className="text-xs text-red-500 mt-1">{errors.expiry.message}</p>
                )}
              </div>
              <div>
                <Input
                  label="CVV *"
                  placeholder="123"
                  className="h-12! border-accent-light! focus-within:border-primary! bg-white! text-center!"
                  {...register("cvc", { onChange: handleCvcChange })}
                />
                {errors.cvc && (
                  <p className="text-xs text-red-500 mt-1">{errors.cvc.message}</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-800 font-medium">جميع المعاملات مشفرة وآمنة بنسبة 100٪</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                className="text-text-muted hover:text-text-dark text-sm underline transition-colors"
                onClick={() => onNext({})}
              >
                تخطي الدفع الآن (يمكنك الاشتراك لاحقاً)
              </button>
            </div>
          </div>

          {/* Checkout Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-primary/5 to-primary-light/5 rounded-xl p-6 border-2 border-accent-light sticky top-8">
              <h3 className="text-lg text-text-dark font-bold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-accent" />
                ملخص الاشتراك
              </h3>

              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-text-dark font-semibold">{planName}</span>
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded">شهري</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-text-muted">السعر الشهري</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">{planPrice}</span>
                    <span className="text-sm text-text-muted">ج.م</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs text-text-muted font-semibold mb-3">المميزات المشمولة:</h4>
                <ul className="space-y-2">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                      <span className="text-xs text-text-dark">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t-2 border-accent-light pt-4 mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-text-dark font-bold">المبلغ الإجمالي</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">{planPrice}</span>
                    <span className="text-text-muted font-medium">ج.م</span>
                  </div>
                </div>
                <p className="text-xs text-text-muted text-left">يتجدد تلقائياً كل شهر</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">يمكنك إلغاء الاشتراك أو تغيير الباقة في أي وقت</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StepSection>

      {/* Footer Navigation Buttons */}
      <StepActions
        onBack={onBack}
        primaryLabel={`تأكيد الدفع (${planPrice} ج.م)`}
      />
    </form>
  );
}

