import { useState, type FormEvent } from "react";
import { Zap, CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/Input";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../types";

interface PaymentStepProps {
  draft: StoreOnboardingDraft;
  onNext: (payment: StoreOnboardingDraft["payment"]) => void;
  onBack: () => void;
}

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

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar - Summary */}
      <div className="md:w-1/3 order-2 md:order-1">
        <div className="bg-bg-cream/40 rounded-3xl border border-accent-light/40 p-6 sticky top-8">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={20} className="text-orange-400" fill="currentColor" />
            <h3 className="font-bold text-text-dark">ملخص الاشتراك</h3>
          </div>

          <div className="space-y-6">
            <div className="pb-6 border-b border-accent-light/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-text-dark">{draft.plan?.name}</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">شهري</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-text-dark">{draft.plan?.price}</span>
                <span className="text-sm text-text-muted">ج.م/شهرياً</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-text-muted">المميزات المشمولة:</p>
              {[
                "كل مميزات الباقة الأساسية",
                "الدفع الإلكتروني مفعل",
                "2 موظفين",
                "تحليلات متقدمة"
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-accent-light/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-text-dark">المبلغ الإجمالي</span>
                <span className="text-xl font-black text-primary">{draft.plan?.price} ج.م</span>
              </div>
              <p className="text-[10px] text-text-muted text-right">يتجدد تلقائياً كل شهر</p>
            </div>

            <div className="bg-white/60 p-3 rounded-2xl flex items-start gap-2 text-[10px] text-text-muted leading-relaxed">
              <ShieldCheck size={14} className="text-primary shrink-0" />
              <span>يمكنك إلغاء الاشتراك أو تغيير الباقة في أي وقت من لوحة التحكم</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main - Form */}
      <form className="flex-1 order-1 md:order-2 space-y-8" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-2">
           <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
             <CreditCard size={20} />
           </div>
           <div>
             <h2 className="font-bold text-text-dark">معلومات البطاقة</h2>
             <p className="text-xs text-text-muted">أدخل بيانات بطاقتك الائتمانية</p>
           </div>
        </div>

        <div className="space-y-6 bg-white p-2 md:p-4 rounded-3xl">
          <Input 
            label="اسم حامل البطاقة *"
            placeholder="أدخل الاسم كما هو مكتوب على البطاقة"
            required
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
          />
          <div className="relative">
            <Input 
              label="رقم البطاقة *"
              placeholder="0000 0000 0000 0000"
              required
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <CreditCard size={18} className="absolute left-4 top-11 text-text-muted/40" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="تاريخ الانتهاء *"
              placeholder="MM/YY"
              required
              maxLength={5}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <Input 
              label="CVV *"
              placeholder="123"
              required
              maxLength={3}
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100/50">
          <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
          <p className="text-xs font-medium text-emerald-800">جميع المعاملات مشفرة وآمنة بنسبة 100%</p>
        </div>

        <div className="text-center">
          <button type="button" className="text-sm font-bold text-text-muted hover:text-text-dark underline underline-offset-4 decoration-accent-light" onClick={() => onNext({})}>
            تخطي الدفع الآن (يمكنك الاشتراك لاحقاً)
          </button>
        </div>

        <StepActions onBack={onBack} primaryLabel="التالي – إعداد المتجر" />
      </form>
    </div>
  );
}
