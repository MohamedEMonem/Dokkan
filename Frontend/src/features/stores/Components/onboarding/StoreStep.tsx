import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import StepSection from "../StepSection";
import StepActions from "../StepActions";
import type { StoreOnboardingDraft } from "../../schemas/draft.types";
import { storeSchema, type StoreFormValues } from "../../schemas/store.schema";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      subdomain: initialData?.subdomain ?? "",
    },
  });

  const onSubmit = (data: StoreFormValues) => {
    onFinish(data);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <StepSection>
        <div className="space-y-6">
          <div>
            <Input
              label="اسم المتجر"
              id="onboarding-store-name"
              placeholder="متجري الرائع"
              isRequired
              error={errors.name?.message}
              {...register("name")}
            />
          </div>
          
          <div>
            <TextArea
              label="وصف المتجر"
              id="onboarding-store-description"
              placeholder="وصف متجرك هنا..."
              rows={4}
              error={errors.description?.message}
              {...register("description")}
            />
          </div>

          <div>
            <Input
              label="النطاق الفرعي"
              id="onboarding-subdomain"
              placeholder="mystore"
              dir="ltr"
              isRequired
              error={errors.subdomain?.message}
              icon={
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm pointer-events-none" dir="ltr">
                  dokkan.com/@
                </span>
              }
              className="relative! pl-28! "
              {...register("subdomain")}
            />
          </div>
        </div>
      </StepSection>

      <StepActions onBack={onBack} primaryLabel="إنشاء المتجر" disabled={isLoading} />
    </form>
  );
}

