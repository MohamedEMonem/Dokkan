import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, HomeIcon } from "lucide-react";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4"
      dir="rtl"
    >
      <Card className="text-center p-8 sm:p-12! max-w-lg w-full">
        {/* Error Icon */}
        <div className="mb-6 sm:mb-8! flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-50 rounded-full flex items-center justify-center">
            <span className="text-4xl sm:text-5xl font-bold text-red-600">
              !
            </span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-red-600 px-2">
          404 — الصفحة غير موجودة
        </h1>
        <p className="mb-8! sm:mb-12! mt-2! text-gray-500 text-base sm:text-lg leading-relaxed px-4">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          {/* Back Button */}
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="h-12 sm:h-14 text-lg sm:text-xl flex-1 rounded-xl shadow-md order-2 sm:order-1"
            icon={<ArrowRight size={24} className="shrink-0" />}
            iconPos="right"
          >
            العودة
          </Button>

          {/* Home Button */}
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="h-12 sm:h-14 text-lg sm:text-xl flex-1 rounded-xl shadow-md order-1 sm:order-2"
            icon={<HomeIcon size={24} className="shrink-0" />}
            iconPos="right"
          >
            الرئيسية
          </Button>
        </div>
      </Card>
    </div>
  );
}
