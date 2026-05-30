import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { 
  Store, 
  CheckCircle2, 
  CreditCard, 
  Globe, 
  ShieldCheck,
  Zap,
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  CircleCheckBig,
  LayoutDashboard,
} from "lucide-react";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useGetPlansQuery } from "@/api/plan.api";
import { showNotification } from "@/utils/showNotification";
import type { IPlan } from "@/types/entities/subscription.types";

const STEP_COUNT = 7;
const STORAGE_KEY = "store_onboarding_draft_v1";

type StoreOnboardingDraft = {
  profile?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  business?: {
    address?: string;
    taxId?: string;
  };
  plan?: {
    planId?: string;
    name?: string;
    price?: number;
  };
  payment?: {
    cardholderName?: string;
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
  };
  store?: {
    name?: string;
    description?: string;
    subdomain?: string;
  };
};

type StepPatch = Partial<StoreOnboardingDraft>;

type StepMeta = {
  title: string;
  subtitle?: string;
};

const stepMeta: StepMeta[] = [
  {
    title: "", // Welcome step handles its own title
    subtitle: "",
  },
  { title: "الخطوة 1 - ملفك الشخصي" },
  { title: "الخطوة 2 - معلومات العمل" },
  { title: "الخطوة 3 - اختر باقة الاشتراك" },
  { title: "بيانات الدفع" },
  { title: "الخطوة 5 - إعداد المتجر" },
  { title: "اكتمل الإعداد!" },
];

function clampStep(step: number) {
  if (Number.isNaN(step)) return 0;
  return Math.min(Math.max(step, 0), STEP_COUNT - 1);
}

function loadDraft(): StoreOnboardingDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as StoreOnboardingDraft;
  } catch {
    return {};
  }
}

export default function StoreOnboarding() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const rawStep = searchParams.get("step");
  const step = useMemo(() => {
    const parsed = Number.parseInt(rawStep ?? "0", 10);
    return clampStep(parsed);
  }, [rawStep]);

  useEffect(() => {
    if (rawStep !== String(step)) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("step", String(step));
      setSearchParams(nextParams, { replace: true });
    }
  }, [rawStep, searchParams, setSearchParams, step]);

  const [draft, setDraft] = useState<StoreOnboardingDraft>(() => loadDraft());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const persistable = { ...draft };
    delete persistable.payment;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  }, [draft]);

  const updateDraft = (patch: StepPatch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const goToStep = (nextStep: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("step", String(clampStep(nextStep)));
    setSearchParams(nextParams);
  };

  const handleNext = (patch: StepPatch) => {
    updateDraft(patch);
    goToStep(step + 1);
  };

  const handleBack = () => {
    goToStep(step - 1);
  };

  const handleFinish = async (patch: StepPatch) => {
    const finalDraft = { ...draft, ...patch };
    updateDraft(patch);

    try {
      // TODO: replace with real submit endpoint.
      console.log("Store onboarding payload:", finalDraft);
      showNotification({ message: "تم حفظ بيانات الإعداد بنجاح", variant: "success" });
      sessionStorage.removeItem(STORAGE_KEY);
      navigate("/dashboard");
    } catch (error) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage =
        err?.data?.message || err?.message || "حدث خطأ غير متوقع";
      showNotification({ message: errorMessage, variant: "error" });
    }
  };

  const progressPercent =
    step > 0 && step < 6 ? Math.round((step / 5) * 100) : step === 6 ? 100 : 0;

  const showProgress = step > 0 && step < 6;
  const isWelcome = step === 0;
  const isSuccess = step === 6;

  const meta = stepMeta[step];

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-bg-cream via-bg-cream to-accent-light" dir="rtl">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {isWelcome ? (
            <WelcomeStep onNext={() => handleNext({})} />
          ) : isSuccess ? (
            <SuccessStep draft={draft} />
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-accent-light/40 p-6 md:p-10">
              {showProgress && (
                <div className="mb-10">
                  <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                    <span>الخطوة {step} من 5</span>
                    <span>{progressPercent}% مكتمل</span>
                  </div>

                  <div className="h-2 w-full bg-accent-light/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl text-text-dark font-semibold">
                  {meta?.title}
                </h1>
                {meta?.subtitle && (
                  <p className="text-text-muted mt-2">{meta.subtitle}</p>
                )}
              </div>

              {step === 1 && (
                <ProfileStep
                  initialData={draft.profile}
                  onNext={(profile) => handleNext({ profile })}
                  onBack={handleBack}
                />
              )}

              {step === 2 && (
                <BusinessStep
                  initialData={draft.business}
                  onNext={(business) => handleNext({ business })}
                  onBack={handleBack}
                />
              )}

              {step === 3 && (
                <PlanStep
                  initialData={draft.plan}
                  onNext={(plan) => handleNext({ plan })}
                  onBack={handleBack}
                />
              )}

              {step === 4 && (
                <PaymentStep
                  draft={draft}
                  onNext={(payment) => handleNext({ payment })}
                  onBack={handleBack}
                />
              )}

              {step === 5 && (
                <StoreStep
                  initialData={draft.store}
                  onFinish={(store) => handleFinish({ store })}
                  onBack={handleBack}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StepSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-accent-light/60 bg-bg-cream/50 p-5 md:p-6 space-y-4">
      <div>
        <h2 className="text-lg text-text-dark font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-text-muted mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function StepActions({
  onBack,
  primaryLabel,
  primaryType,
  disabled = false,
}: {
  onBack?: () => void;
  primaryLabel: string;
  primaryType?: "submit" | "button";
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
      <Button
        type="button"
        variant="outline-accent"
        className="!inline-flex !w-fit !h-9 !px-4 !py-2  gap-2 rounded-lg text-sm! border! outline-none! text-black! transition-all hover:text-white! disabled:opacity-50 shrink-0"
        onClick={onBack}
        disabled={!onBack}
      >
        <ArrowRight size={16} />
        رجوع
      </Button>
      <Button 
        type={primaryType || "submit"}
        variant="primary"
        className="!inline-flex !w-fit !h-9 !px-4 !py-2  gap-2 rounded-lg text-sm! font-bold border! outline-none! shrink-0"
        disabled={disabled}
      >
        {primaryLabel}
        <ArrowLeft size={16} />
      </Button>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Upper stepper section in a card */}
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl text-gray-900 mb-4 font-bold">مرحباً بك في مركز البائعين - دكان</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            لنقم بإعداد ملفك الشخصي وإنشاء متجرك ببضع خطوات بسيطة.
          </p>
        </div>

        <div className="flex flex-row items-center justify-between max-w-2xl mx-auto mb-12 py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">المعلومات الشخصية</span>
          </div>

          <ArrowLeft className="w-6 h-6 text-[#005B7F] mt-[-24px]" />

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">تفاصيل النشاط التجاري</span>
          </div>

          <ArrowLeft className="w-6 h-6 text-[#005B7F] mt-[-24px]" />

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Store className="w-8 h-8 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">إعداد المتجر</span>
          </div>

          <ArrowLeft className="w-6 h-6 text-[#005B7F] mt-[-24px]" />

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
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
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

function ProfileStep({
  initialData,
  onNext,
  onBack,
}: {
  initialData?: StoreOnboardingDraft["profile"];
  onNext: (profile: StoreOnboardingDraft["profile"]) => void;
  onBack: () => void;
}) {
  const [fullName, setFullName] = useState(initialData?.fullName ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onNext({ fullName, email, phone });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <StepSection title="أخبرنا عن نفسك للبدء">
        <div className="space-y-6">
          <Input
            label="الاسم الكامل *"
            id="onboarding-full-name"
            placeholder="أحمد محمد"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <div className="space-y-1">
            <Input
              label="البريد الإلكتروني *"
              id="onboarding-email"
              type="email"
              placeholder="ahmed@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <p className="text-xs text-text-muted">سنرسل رسالة تحقق إذا قمت بتغيير البريد</p>
          </div>
          <Input
            label="رقم الهاتف"
            id="onboarding-phone"
            type="tel"
            placeholder="1234567890 20+"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
      </StepSection>

      <StepActions onBack={onBack} primaryLabel="التالي – معلومات العمل" />
    </form>
  );
}

function BusinessStep({
  initialData,
  onNext,
  onBack,
}: {
  initialData?: StoreOnboardingDraft["business"];
  onNext: (business: StoreOnboardingDraft["business"]) => void;
  onBack: () => void;
}) {
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [taxId, setTaxId] = useState(initialData?.taxId ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onNext({ address, taxId });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <StepSection title="ساعدنا على فهم عملك">
        <div className="space-y-6">
          <TextArea
            label="عنوان العمل"
            id="onboarding-business-address"
            placeholder="123 شارع الهرم، الجيزة، مصر"
            rows={3}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <div className="space-y-1">
            <Input
              label="الرقم الضريبي *"
              id="onboarding-tax-id"
              placeholder="123456789"
              required
              value={taxId}
              onChange={(event) => setTaxId(event.target.value)}
            />
            <p className="text-xs text-text-muted">رقم التسجيل الضريبي المكون من 9 أرقام</p>
          </div>
        </div>
      </StepSection>

      <StepActions onBack={onBack} primaryLabel="التالي – اختيار الباقة" />
    </form>
  );
}

function PlanStep({
  initialData,
  onNext,
  onBack,
}: {
  initialData?: StoreOnboardingDraft["plan"];
  onNext: (plan: StoreOnboardingDraft["plan"]) => void;
  onBack: () => void;
}) {
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
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-xl text-text-muted">اختر الباقة المناسبة لاحتياجات متجرك</h2>
      </div>

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

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: IPlan;
  isSelected: boolean;
  onSelect: () => void;
}) {
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

function PaymentStep({
  draft,
  onNext,
  onBack,
}: {
  draft: StoreOnboardingDraft;
  onNext: (payment: StoreOnboardingDraft["payment"]) => void;
  onBack: () => void;
}) {
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

function StoreStep({
  initialData,
  onFinish,
  onBack,
}: {
  initialData?: StoreOnboardingDraft["store"];
  onFinish: (store: StoreOnboardingDraft["store"]) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [subdomain, setSubdomain] = useState(initialData?.subdomain ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onFinish({ name, description, subdomain });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <StepSection title="اضبط تفاصيل متجرك وعلامته التجارية">
        <div className="space-y-6">
          <Input
            label="اسم المتجر *"
            id="onboarding-store-name"
            placeholder="متجري الرائع"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextArea
            label="وصف المتجر"
            id="onboarding-store-description"
            placeholder="وصف متجرك هنا..."
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-dark">النطاق الفرعي *</label>
            <div className="flex items-center gap-2 group">
              <div className="flex-1">
                <Input
                  id="onboarding-subdomain"
                  placeholder="mystore"
                  required
                  value={subdomain}
                  onChange={(event) => setSubdomain(event.target.value)}
                />
              </div>
              <span className="text-text-muted font-bold pt-6">.Dokan.com</span>
            </div>
            <p className="text-[10px] text-text-muted">3-30 حرف، حروف صغيرة وأرقام وشرطات فقط</p>
          </div>
        </div>
      </StepSection>

      <StepActions onBack={onBack} primaryLabel="إنشاء المتجر" />
    </form>
  );
}

function SuccessStep({ draft }: { draft: StoreOnboardingDraft }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-500 mb-2">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-text-dark">اكتمل الإعداد!</h1>
        <p className="text-lg text-text-muted">متجرك جاهز الآن للبدء في البيع</p>
      </div>

      <div className="bg-white rounded-3xl border border-accent-light/40 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-accent-light/40 bg-bg-cream/20">
          <h3 className="font-bold text-text-dark">ملخص الحساب</h3>
        </div>
        <div className="p-6 space-y-4">
           <SummaryRow label="الاسم" value={draft.profile?.fullName} />
           <SummaryRow label="البريد" value={draft.profile?.email} />
           <SummaryRow label="اسم المتجر" value={draft.store?.name} />
           <SummaryRow label="رابط المتجر" value={draft.store?.subdomain ? `https://${draft.store.subdomain}.Dokan.com` : "---"} isLink />
           <SummaryRow label="العملة" value="EGP" />
           <SummaryRow label="المنطقة الزمنية" value="Africa/Cairo" />
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark font-bold text-lg h-auto shadow-lg shadow-primary/20"
          onClick={() => {}} 
        >
          اختيار مظهر المتجر
        </Button>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" className="py-4 rounded-2xl font-bold h-auto border-accent-light" onClick={() => navigate("/dashboard")}>
            تخطي للوحة التحكم
          </Button>
          <Button variant="secondary" className="py-4 rounded-2xl font-bold h-auto border-accent-light flex items-center justify-center gap-2">
            زيارة المتجر
            <Globe size={18} />
          </Button>
        </div>
      </div>

      <div className="bg-bg-cream/40 p-6 rounded-3xl border border-accent-light/40 space-y-4">
        <h4 className="font-bold text-text-dark">ما التالي؟</h4>
        <ul className="space-y-3">
          {[
            "اختر مظهر متجرك وألوانه",
            "أضف منتجاتك الأولى إلى المتجر",
            "إعداد طرق الدفع (فوري، بايموب، سترايب)",
            "تكوين إعدادات الشحن والضرائب"
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, isLink }: { label: string, value?: string, isLink?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-accent-light/20 last:border-0">
      <span className="text-sm text-text-muted">{label}:</span>
      {isLink ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline">{value}</a>
      ) : (
        <span className="text-sm font-bold text-text-dark">{value || "---"}</span>
      )}
    </div>
  );
}
