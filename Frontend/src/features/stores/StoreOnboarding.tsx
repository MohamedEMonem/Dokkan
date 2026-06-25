import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "@/components/layout/Header/Header";
import { showNotification } from "@/utils/showNotification";
import { useCreateStoreMutation } from "@/api/store.api";
import { useUpdateProfileMutation } from "@/api/user.api";

import ProfileStep from "./Components/onboarding/ProfileStep";
import BusinessStep from "./Components/onboarding/BusinessStep";
import PlanStep from "./Components/onboarding/PlanStep";
import PaymentStep from "./Components/onboarding/PaymentStep";
import StoreStep from "./Components/onboarding/StoreStep";

// Import types
import type { StoreOnboardingDraft, StepPatch } from "./schemas/draft.types";

const STEP_COUNT = 5;
const STORAGE_KEY = "store_onboarding_draft_v1";

type StepMeta = { title: string; subtitle?: string };

const stepMeta: StepMeta[] = [
  { title: "الخطوة 1 - ملفك الشخصي", subtitle: "أخبرنا عن نفسك للبدء" },
  { title: "الخطوة 2 - معلومات العمل", subtitle: "ساعدنا على فهم عملك" },
  {
    title: "الخطوة 3 - اختر باقة الاشتراك",
    subtitle: "اختر الباقة المناسبة لاحتياجات متجرك",
  },
  { title: "بيانات الدفع", subtitle: "أدخل معلومات الدفع لتفعيل اشتراكك" },
  {
    title: "الخطوة 5 - إعداد المتجر",
    subtitle: "اضبط تفاصيل متجرك وعلامته التجارية",
  },
];

function clampStep(step: number) {
  if (Number.isNaN(step)) return 1;
  return Math.min(Math.max(step, 1), STEP_COUNT);
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
  const [createStore, { isLoading: isSubmitting }] = useCreateStoreMutation();
  const [updateProfile] = useUpdateProfileMutation();

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
      // 1. Update owner profile (name and personal phone number)
      if (finalDraft.profile?.phone || finalDraft.profile?.fullName) {
        await updateProfile({
          name: finalDraft.profile.fullName || undefined,
          contactNumber: finalDraft.profile.phone || undefined,
        }).unwrap();
      }

      // 2. Create the store with business address, tax number, and business phone
      const payload = {
        name: finalDraft.store?.name || "",
        subdomain: finalDraft.store?.subdomain || "",
        logoUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef", // Default placeholder logo
        description: finalDraft.store?.description || "",
        businessAddress: finalDraft.business?.address || "",
        vatNumber: finalDraft.business?.taxId || "",
        supportEmail: finalDraft.profile?.email || undefined,
        phoneNumber: finalDraft.business?.phone || undefined,
      };

      await createStore({ data: payload }).unwrap();
      // On success, clear the draft from session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      showNotification({
        message: "تم حفظ بيانات الإعداد وإنشاء المتجر بنجاح",
        variant: "success",
      });
      navigate("/store/onboarding/success");
    } catch (error) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage =
        err?.data?.message || err?.message || "حدث خطأ غير متوقع";
      showNotification({ message: errorMessage, variant: "error" });
    }
  };

  const progressPercent = Math.round((step / STEP_COUNT) * 100);
  const meta = stepMeta[step - 1];

  return (
    <div
      className="min-h-screen flex flex-col bg-linear-to-br from-bg-cream via-bg-cream to-accent-light"
      dir="rtl"
    >
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div
            className={`mx-auto bg-white rounded-3xl shadow-lg border border-accent-light/40 p-6 md:p-10 transition-all duration-300 ${step === 3 ? "max-w-6xl" : "max-w-4xl"}`}
          >
            <div className="mb-10">
              <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                <span>
                  الخطوة {step} من {STEP_COUNT}
                </span>
                <span>{progressPercent}% مكتمل</span>
              </div>
              <div className="h-2 w-full bg-accent-light/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl text-text-dark font-semibold">
                {meta?.title}
              </h1>
              {meta?.subtitle && (
                <p className="text-lg text-text-muted mt-2">{meta.subtitle}</p>
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
                personalPhone={draft.profile?.phone}
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
                isLoading={isSubmitting}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
