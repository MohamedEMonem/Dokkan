import { useState, type FormEvent } from "react";
import { CreditCard, Shield, Crown, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../types";

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
  const [cardholderName, setCardholderName] = useState(draft.payment?.cardholderName ?? "");
  const [cardNumber, setCardNumber] = useState(draft.payment?.cardNumber ?? "");
  const [expiry, setExpiry] = useState(draft.payment?.expiry ?? "");
  const [cvc, setCvc] = useState(draft.payment?.cvc ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onNext({ cardholderName, cardNumber, expiry, cvc });
  };

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g) || [];
    setCardNumber(groups.join(" ").substring(0, 19));
  };

  const handleExpiryChange = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length > 2) {
      digits = digits.substring(0, 2) + "/" + digits.substring(2, 4);
    }
    setExpiry(digits.substring(0, 5));
  };

  const handleCvcChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setCvc(digits.substring(0, 3));
  };

  const planSlug = draft.plan?.slug?.toLowerCase() || "basic";
  const features = PLAN_FEATURES[planSlug] || PLAN_FEATURES.basic;
  const planName = draft.plan?.name || "الأساسية";
  const planPrice = draft.plan?.price || 999;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StepSection>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card Details Section */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#005B7F] to-[#007AA3] rounded-lg flex items-center justify-center shadow-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl text-[#2B2B2B] font-semibold">معلومات البطاقة</h2>
                <p className="text-xs text-[#6B6B6B]">أدخل بيانات بطاقتك الائتمانية</p>
              </div>
            </div>

            <Input
              label="اسم حامل البطاقة *"
              placeholder="أدخل الاسم كما هو مكتوب على البطاقة"
              required
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="h-12! border-[#EBD8B7]! focus-within:border-[#005B7F]! bg-white!"
            />

            <Input
              label="رقم البطاقة *"
              placeholder="0000 0000 0000 0000"
              required
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              icon={<CreditCard className="w-5 h-5 text-[#6B6B6B]" />}
              className="h-12! border-[#EBD8B7]! focus-within:border-[#005B7F]! bg-white! flex-row-reverse!"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="تاريخ الانتهاء *"
                placeholder="MM/YY"
                required
                value={expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                className="h-12! border-[#EBD8B7]! focus-within:border-[#005B7F]! bg-white! text-center!"
              />
              <Input
                label="CVV *"
                placeholder="123"
                required
                value={cvc}
                onChange={(e) => handleCvcChange(e.target.value)}
                className="h-12! border-[#EBD8B7]! focus-within:border-[#005B7F]! bg-white! text-center!"
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-800 font-medium">جميع المعاملات مشفرة وآمنة بنسبة 100٪</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                className="text-[#6B6B6B] hover:text-[#2B2B2B] text-sm underline transition-colors"
                onClick={() => onNext({})}
              >
                تخطي الدفع الآن (يمكنك الاشتراك لاحقاً)
              </button>
            </div>
          </div>

          {/* Checkout Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#005B7F]/5 to-[#007AA3]/5 rounded-xl p-6 border-2 border-[#EBD8B7] sticky top-8">
              <h3 className="text-lg text-[#2B2B2B] font-bold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#C49A6C]" />
                ملخص الاشتراك
              </h3>

              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#2B2B2B] font-semibold">{planName}</span>
                  <span className="text-xs bg-[#005B7F] text-white px-2 py-1 rounded">شهري</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-[#6B6B6B]">السعر الشهري</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#005B7F]">{planPrice}</span>
                    <span className="text-sm text-[#6B6B6B]">ج.م</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs text-[#6B6B6B] font-semibold mb-3">المميزات المشمولة:</h4>
                <ul className="space-y-2">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#2B2B2B]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t-2 border-[#EBD8B7] pt-4 mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[#2B2B2B] font-bold">المبلغ الإجمالي</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#005B7F]">{planPrice}</span>
                    <span className="text-[#6B6B6B] font-medium">ج.م</span>
                  </div>
                </div>
                <p className="text-xs text-[#6B6B6B] text-left">يتجدد تلقائياً كل شهر</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
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
