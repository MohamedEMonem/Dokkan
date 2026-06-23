import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../../schemas/draft.types";
import { businessSchema, type BusinessFormValues } from "../../schemas/business.schema";

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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      address: initialData?.address ?? "",
      taxId: initialData?.taxId ?? "",
      phone: initialData?.phone ?? "",
    },
  });

  const phone = watch("phone");
  const isChecked = !!personalPhone && phone === personalPhone;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setValue("phone", personalPhone ?? "");
    } else {
      setValue("phone", "");
    }
  };

  const onSubmit = (data: BusinessFormValues) => {
    onNext(data);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <StepSection>
        <div className="space-y-6">
          <div>
            <TextArea
              label="عنوان العمل"
              id="onboarding-business-address"
              placeholder="123 شارع الهرم، الجيزة، مصر"
              rows={3}
              error={errors.address?.message}
              {...register("address")}
            />
          </div>

          <div>
            <Input
              label="الرقم الضريبي"
              id="onboarding-tax-id"
              placeholder="123456789"
              isRequired
              error={errors.taxId?.message}
              {...register("taxId")}
            />
            <p className="text-xs text-text-muted mt-1">رقم التسجيل الضريبي المكون من 9 أرقام</p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                label="رقم هاتف العمل"
                id="onboarding-business-phone"
                type="tel"
                placeholder="1234567890 20+"
                autoComplete="tel"
                disabled={isChecked}
                className="[&_input]:text-right"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

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

