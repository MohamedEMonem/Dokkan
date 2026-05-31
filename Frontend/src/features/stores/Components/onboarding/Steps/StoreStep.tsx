import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../types";

interface StoreStepProps {
  initialData?: StoreOnboardingDraft["store"];
  onFinish: (store: StoreOnboardingDraft["store"]) => void;
  onBack: () => void;
}

export default function StoreStep({
  initialData,
  onFinish,
  onBack,
}: StoreStepProps) {
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
