import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { useGetProfileQuery } from "@/api/user.api";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../../schemas/draft.types";
import { profileSchema, type ProfileFormValues } from "../../schemas/profile.schema";

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData?.fullName ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      if (initialData?.fullName === undefined) setValue("fullName", user.name);
      if (initialData?.email === undefined) setValue("email", user.email);
      if (initialData?.phone === undefined) setValue("phone", user.contactNumber ?? "");
    }
  }, [user, initialData, setValue]);

  const onSubmit = (data: ProfileFormValues) => {
    onNext(data);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <StepSection>
        <div className="space-y-6">
          <div>
            <Input
              label="الاسم الكامل *"
              id="onboarding-full-name"
              placeholder="أحمد محمد"
              autoComplete="name"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              label="البريد الإلكتروني *"
              id="onboarding-email"
              type="email"
              placeholder="ahmed@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
            <p className="text-xs text-text-muted">سنرسل رسالة تحقق إذا قمت بتغيير البريد</p>
          </div>

          <div>
            <Input
              label="رقم الهاتف"
              id="onboarding-phone"
              type="tel"
              placeholder="1234567890 20+"
              autoComplete="tel"
              {...register("phone")}
              style={{ textAlign: "right" }}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </StepSection>

      <StepActions onBack={onBack} primaryLabel="التالي – معلومات العمل" />
    </form>
  );
}

