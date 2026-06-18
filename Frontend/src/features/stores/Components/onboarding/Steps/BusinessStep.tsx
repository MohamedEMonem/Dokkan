import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../types";

interface BusinessStepProps {
  initialData?: StoreOnboardingDraft["business"];
  onNext: (business: StoreOnboardingDraft["business"]) => void;
  onBack: () => void;
}

export default function BusinessStep({
  initialData,
  onNext,
  onBack,
}: BusinessStepProps) {
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [taxId, setTaxId] = useState(initialData?.taxId ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onNext({ address, taxId });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <StepSection>
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
