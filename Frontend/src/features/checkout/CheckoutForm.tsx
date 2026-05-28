import React, { useCallback } from "react";
import clsx from "clsx";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Package, CreditCard } from "lucide-react";
import type { CheckoutFormValues } from "@/features/checkout/schemas/checkout.schema";

export type Address = CheckoutFormValues["address"];
export type FormState = CheckoutFormValues;

const GOVERNORATES = [
  { value: "cairo", label: "القاهرة" },
  { value: "al-giza", label: "الجيزة" },
  { value: "alexandria", label: "الإسكندرية" },
  { value: "dakahlia", label: "الدقهلية" },
  { value: "sharkia", label: "الشرقية" },
  { value: "qalyubia", label: "القليوبية" },
  { value: "kfs", label: "كفر الشيخ" },
  { value: "gharbia", label: "الغربية" },
  { value: "manofia", label: "المنوفية" },
];

interface Props {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

export default function CheckoutForm({ form, setForm }: Props) {
  const handleChangeAddress = useCallback(
    (field: keyof Address, value: string) => {
      setForm((prev: FormState) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    },
    [setForm],
  );

  const handlePaymentMethod = useCallback(
    (method: FormState["paymentMethod"]) =>
      setForm((p: FormState) => ({ ...p, paymentMethod: method })),
    [setForm],
  );

  const handleChangeField = useCallback(
    (
      field:
        | "fullName"
        | "email"
        | "phone"
        | "cardholderName"
        | "cardNumber"
        | "expiryDate"
        | "cvv",
      value: string,
    ) => {
      setForm((prev: FormState) => ({ ...prev, [field]: value }));
    },
    [setForm],
  );

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="mb-6">معلومات التصال</h2>
        <div className="space-y-4">
          <div>
            <Input
              id="fullName"
              name="fullName"
              label="الاسم الكامل *"
              required
              value={form.fullName}
              onChange={(e) => handleChangeField("fullName", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                label="البريد الإلكتروني *"
                required
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
              />
            </div>
            <div>
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="رقم الهاتف *"
                required
                value={form.phone}
                onChange={(e) => handleChangeField("phone", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="mb-6">عنوان الشحن</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="governorate"
                className="flex items-center gap-2 text-sm font-medium"
              >
                المحافظة *
              </label>
              <Select
                id="governorate"
                required
                value={form.address.governorate || ""}
                onChange={(e) =>
                  handleChangeAddress("governorate", e.target.value)
                }
                options={GOVERNORATES}
                placeholder="اختر المحافظة"
              />
            </div>
            <div>
              <Input
                id="city"
                name="city"
                label="المدينة *"
                placeholder="مثال: مدينة نصر، المعادي، ..."
                required
                value={form.address.city}
                onChange={(e) => handleChangeAddress("city", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Input
              id="address"
              name="address"
              label="العنوان بالتفصيل *"
              placeholder="الشارع، رقم المبنى، الدور، رقم الشقة"
              required
              value={form.address.street}
              onChange={(e) => handleChangeAddress("street", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="mb-6">طريقة الدفع</h2>

        <div role="radiogroup" className="grid gap-3">
          <label
            className={clsx(
              "flex items-center gap-4 p-4 rounded-xl border transition-shadow",
              form.paymentMethod === "cod"
                ? "border-green-500 bg-green-50 shadow-sm"
                : "border-gray-200 bg-white hover:shadow-sm",
            )}
          >
            <div className="flex items-center gap-4 flex-1">
              <input
                type="radio"
                name="payment"
                value="cod"
                dir="right"
                checked={form.paymentMethod === "cod"}
                onChange={() => handlePaymentMethod("cod")}
                className="ml-auto"
              />
              <div className="flex flex-col gap-1 flex-1 text-right">
                <div className="font-semibold">الدفع عند الاستلام</div>
                <div className="text-sm text-gray-600">
                  ادفع نقداً عند استلام الطلب
                </div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#DCFCE7]">
                <Package className="w-5 h-5 text-[#22C55E]" />
              </div>
            </div>
          </label>

          <label
            className={clsx(
              "flex items-center gap-4 p-4 rounded-xl border transition-shadow",
              form.paymentMethod === "stripe"
                ? "border-blue-600 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:shadow-sm",
            )}
          >
            <div className="flex items-center gap-4 flex-1">
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={form.paymentMethod === "stripe"}
                onChange={() => handlePaymentMethod("stripe")}
                className="ml-auto"
              />

              <div className="flex flex-col gap-1 flex-1 text-right">
                <div className="font-semibold">بطاقة ائتمان</div>
                <div className="text-sm text-gray-600">
                  ادفع باستخدام البطاقة الائتمانية
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E3F2FD]">
              <CreditCard className="w-5 h-5 text-[#0A66C2]" />
            </div>
          </label>
        </div>

        <div className="mt-6 p-4 bg-[#F0F6FF] border border-[#0A66C2]/20 rounded-xl">
          <p className="text-sm text-[#0A66C2]">
            🔒 معلومات الدفع الخاصة بك آمنة ومشفرة. هذا تطبيق تجريبي - لن يتم
            تحصيل رسوم حقيقية.
          </p>
        </div>

        {form.paymentMethod === "stripe" && (
          <div className="mt-6 p-6 bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-200">
            <h3 className="mb-5 text-text-dark">بيانات البطاقة الائتمانية</h3>
            <div className="space-y-4">
              <div>
                <Input
                  id="cardholderName"
                  label="اسم حامل البطاقة *"
                  value={form.cardholderName}
                  onChange={(e) =>
                    handleChangeField("cardholderName", e.target.value)
                  }
                  placeholder="الاسم كما هو مكتوب على البطاقة"
                  className="mt-2"
                />
              </div>
              <div>
                <div className="relative mt-2">
                  <Input
                    id="cardNumber"
                    label="رقم البطاقة *"
                    value={form.cardNumber}
                    onChange={(e) =>
                      handleChangeField("cardNumber", e.target.value)
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="pr-12"
                    icon={<CreditCard className="w-5 h-5 text-gray-400" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="expiryDate"
                    label="تاريخ الانتهاء *"
                    value={form.expiryDate}
                    onChange={(e) =>
                      handleChangeField("expiryDate", e.target.value)
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Input
                    id="cvv"
                    type="password"
                    label="رمز الأمان (CVV) *"
                    value={form.cvv}
                    onChange={(e) => handleChangeField("cvv", e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
