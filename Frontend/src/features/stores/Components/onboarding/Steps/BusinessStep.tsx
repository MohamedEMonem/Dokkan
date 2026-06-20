import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../types";

interface BusinessStepProps {
  initialData?: StoreOnboardingDraft["business"];
  personalPhone?: string;
  onNext: (business: StoreOnboardingDraft["business"]) => void;
  onBack: () => void;
}

export default function BusinessStep({
  initialData,
  personalPhone,
  onNext,
  onBack,
}: BusinessStepProps) {
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [taxId, setTaxId] = useState(initialData?.taxId ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");

  const isChecked = !!personalPhone && phone === personalPhone;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setPhone(personalPhone ?? "");
    } else {
      setPhone("");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onNext({
      address,
      taxId,
      phone,
    });
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

          <div className="space-y-4">
            <Input
              label="رقم هاتف العمل"
              id="onboarding-business-phone"
              type="tel"
              placeholder="1234567890 20+"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={isChecked}
              className="[&_input]:text-right"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="use-personal-phone"
                className="h-4 w-4 rounded border-accent-light accent-primary cursor-pointer"
                checked={isChecked}
                onChange={handleCheckboxChange}
                disabled={!personalPhone}
              />
              <label htmlFor="use-personal-phone" className="text-sm text-text-muted cursor-pointer select-none">
                استخدام رقم الهاتف الشخصي كرقم العمل
              </label>
            </div>
          </div>
        </div>
      </StepSection>

      <StepActions onBack={onBack} primaryLabel="التالي – اختيار الباقة" />
    </form>
  );
}
