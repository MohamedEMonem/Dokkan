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
  isLoading?: boolean;
}

export default function StoreStep({
  initialData,
  onFinish,
  onBack,
  isLoading = false,
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
      <StepSection>
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

          <Input
            label="النطاق الفرعي *"
            id="onboarding-subdomain"
            placeholder="mystore"
            required
            value={subdomain}
            onChange={(event) => setSubdomain(event.target.value)}
            dir="ltr"
            icon={
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm pointer-events-none" dir="ltr">
                dokkan.com/@
              </span>
            }
            className="relative! pl-28! "
          />
        </div>
      </StepSection>

      <StepActions onBack={onBack} primaryLabel="إنشاء المتجر" disabled={isLoading} />
    </form>
  );
}
