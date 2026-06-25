import { useNavigate } from "react-router-dom";
import { CheckCircle2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header/Header";
import { useGetProfileQuery } from "@/api/user.api";
import { useGetUserStoreQuery } from "@/api/store.api";

export default function SuccessStep() {
  const navigate = useNavigate();
  const { data: profileResponse, isLoading: profileLoading } = useGetProfileQuery();
  const { data: storeResponse, isLoading: storeLoading } = useGetUserStoreQuery();

  const user = profileResponse?.data?.user;
  const store = storeResponse?.data?.store;

  const name = profileLoading ? "جاري التحميل..." : (user?.name || "---");
  const email = profileLoading ? "جاري التحميل..." : (user?.email || "---");
  const storeName = storeLoading ? "جاري التحميل..." : (store?.name || "---");
  const storeSubdomain = storeLoading ? "" : (store?.subdomain || "");
  const storeLink = storeSubdomain ? `https://dokkan.com/@${storeSubdomain}` : "---";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <Header />
      <main className="flex-1">
        <div className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h1 className="text-4xl text-gray-900 mb-3 font-bold">اكتمل الإعداد!</h1>
              <p className="text-lg text-gray-600 font-medium">متجرك جاهز الآن للبدء في البيع</p>
            </div>

            {/* Account Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-6">
              <h2 className="text-xl text-gray-900 mb-6 font-semibold">ملخص الحساب</h2>
              <div className="space-y-4">
                <SummaryRow label="الاسم" value={name} />
                <SummaryRow label="البريد" value={email} />
                <SummaryRow label="اسم المتجر" value={storeName} />
                <SummaryRow label="رابط المتجر" value={storeLink} isLink={!!storeSubdomain} />
                <SummaryRow label="العملة" value="EGP" />
                <SummaryRow label="المنطقة الزمنية" value="Africa/Cairo" />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full h-10! rounded-md! font-semibold!"
                onClick={() => navigate("/dashboard/customize")}
              >
                اختيار مظهر المتجر
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  className="w-full h-10! rounded-md! border! border-gray-200! bg-white! text-gray-700! hover:bg-gray-50! transition-colors! font-semibold!"
                  onClick={() => navigate("/dashboard")}
                >
                  تخطي للوحة التحكم
                </Button>
                <Button
                  variant="secondary"
                  className="w-full h-10! rounded-md! border! border-gray-200! bg-white! text-gray-700! hover:bg-gray-50! transition-colors! flex items-center justify-center gap-2 font-semibold!"
                  onClick={() => {
                    if (storeSubdomain) {
                      window.open(`https://dokkan.com/@${storeSubdomain}`, "_blank");
                    }
                  }}
                  disabled={!storeSubdomain || storeLoading}
                  icon={<ExternalLink size={16} className="mr-2" />}
                  iconPos="right"
                >
                  زيارة المتجر
                </Button>
              </div>
            </div>

            {/* What's next list */}
            <div className="bg-blue-50 rounded-xl p-6 mt-8">
              <h3 className="text-gray-900 font-semibold mb-3">ما التالي؟</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "اختر مظهر متجرك وألوانه",
                  "أضف منتجاتك الأولى إلى المتجر",
                  "إعداد طرق الدفع (فوري، بايموب، سترايب)",
                  "تكوين إعدادات الشحن والضرائب",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-600 ml-2 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value?: string;
  isLink?: boolean;
}

function SummaryRow({ label, value, isLink }: SummaryRowProps) {
  return (
    <div className="grid grid-cols-3 py-4 border-b border-gray-200 last:border-0">
      <span className="text-gray-600">{label}:</span>
      {isLink && value && value !== "---" ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 text-blue-600 hover:text-blue-700 underline break-all font-medium"
        >
          {value}
        </a>
      ) : (
        <span className="col-span-2 text-gray-900 font-semibold">{value || "---"}</span>
      )}
    </div>
  );
}
