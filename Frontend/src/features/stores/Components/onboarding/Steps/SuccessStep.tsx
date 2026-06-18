import { useNavigate } from "react-router-dom";
import { CheckCircle2, Globe } from "lucide-react";

import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
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
  const storeLink = storeSubdomain ? `https://${storeSubdomain}.Dokan.com` : "---";

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-bg-cream via-bg-cream to-accent-light" dir="rtl">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-500 mb-2">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-3xl font-black text-text-dark">اكتمل الإعداد!</h1>
              <p className="text-lg text-text-muted">متجرك جاهز الآن للبدء في البيع</p>
            </div>

            <div className="bg-white rounded-3xl border border-accent-light/40 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-accent-light/40 bg-bg-cream/20">
                <h3 className="font-bold text-text-dark">ملخص الحساب</h3>
              </div>
              <div className="p-6 space-y-4">
                <SummaryRow label="الاسم" value={name} />
                <SummaryRow label="البريد" value={email} />
                <SummaryRow label="اسم المتجر" value={storeName} />
                <SummaryRow label="رابط المتجر" value={storeLink} isLink={!!storeSubdomain} />
                <SummaryRow label="العملة" value="EGP" />
                <SummaryRow label="المنطقة الزمنية" value="Africa/Cairo" />
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark font-bold text-lg h-auto shadow-lg shadow-primary/20"
                onClick={() => {}} 
              >
                اختيار مظهر المتجر
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" className="py-4 rounded-2xl font-bold h-auto border-accent-light" onClick={() => navigate("/dashboard")}>
                  تخطي للوحة التحكم
                </Button>
                <Button 
                  variant="secondary" 
                  className="py-4 rounded-2xl font-bold h-auto border-accent-light flex items-center justify-center gap-2"
                  onClick={() => {
                    if (storeSubdomain) {
                      window.open(`https://${storeSubdomain}.Dokkan.com`, "_blank");
                    }
                  }}
                  disabled={!storeSubdomain || storeLoading}
                >
                  زيارة المتجر
                  <Globe size={18} />
                </Button>
              </div>
            </div>

            <div className="bg-bg-cream/40 p-6 rounded-3xl border border-accent-light/40 space-y-4">
              <h4 className="font-bold text-text-dark">ما التالي؟</h4>
              <ul className="space-y-3">
                {[
                  "اختر مظهر متجرك وألوانه",
                  "أضف منتجاتك الأولى إلى المتجر",
                  "إعداد طرق الدفع (فوري، بايموب، سترايب)",
                  "تكوين إعدادات الشحن والضرائب"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-text-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
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
    <div className="flex items-center justify-between py-2 border-b border-accent-light/20 last:border-0">
      <span className="text-sm text-text-muted">{label}:</span>
      {isLink && value && value !== "---" ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline">{value}</a>
      ) : (
        <span className="text-sm font-bold text-text-dark">{value || "---"}</span>
      )}
    </div>
  );
}
