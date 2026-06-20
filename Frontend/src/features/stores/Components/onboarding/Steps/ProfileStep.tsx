import { useEffect, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { useGetProfileQuery } from "@/api/user.api";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../types";

interface ProfileStepProps {
  initialData?: StoreOnboardingDraft["profile"];
  onNext: (profile: StoreOnboardingDraft["profile"]) => void;
  onBack: () => void;
}

export default function ProfileStep({
  initialData,
  onNext,
  onBack,
}: ProfileStepProps) {
  const { data: profileData } = useGetProfileQuery();
  const user = profileData?.data?.user;

  const [fullName, setFullName] = useState(initialData?.fullName ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");

  useEffect(() => {
    if (user) {
      if (initialData?.fullName === undefined) setFullName(user.name);
      if (initialData?.email === undefined) setEmail(user.email);
      if (initialData?.phone === undefined) setPhone(user.contactNumber ?? "");
    }
  }, [user, initialData]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onNext({ fullName, email, phone });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <StepSection>
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
            style={{ textAlign: "right" }}
          />
        </div>
      </StepSection>

      <StepActions onBack={onBack} primaryLabel="التالي – معلومات العمل" />
    </form>
  );
}
