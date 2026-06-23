import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface StepActionsProps {
  onBack?: () => void;
  primaryLabel: string;
  primaryType?: "submit" | "button";
  disabled?: boolean;
}

export default function StepActions({
  onBack,
  primaryLabel,
  primaryType,
  disabled = false,
}: StepActionsProps) {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
      <Button
        type="button"
        variant="outline-accent"
        className="inline-flex! w-fit! h-9! px-4! py-2!  gap-2 rounded-lg text-sm! border! outline-none! text-black! transition-all hover:text-white! disabled:opacity-50 shrink-0"
        onClick={onBack}
        disabled={!onBack}
      >
        <ArrowRight size={16} />
        رجوع
      </Button>
      <Button 
        type={primaryType || "submit"}
        variant="primary"
        className="inline-flex! w-fit! h-9! px-4! py-2!  gap-2 rounded-lg text-sm! font-bold border! outline-none! shrink-0"
        disabled={disabled}
      >
        {primaryLabel}
        <ArrowLeft size={16} />
      </Button>
    </div>
  );
}
