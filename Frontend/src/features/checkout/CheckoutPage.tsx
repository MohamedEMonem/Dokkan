import React, { useEffect, useState, useCallback } from "react";
import { useGetCartQuery } from "@/api/cart.api";
import CheckoutForm, { FormState } from "@/features/checkout/CheckoutForm";
import type { ICartResponse } from "@/types/entities/cart.types";
import CheckoutSummary from "./CheckoutSummary";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@/api/order.api";
import { showNotification } from "@/utils/showNotification";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data: cartData } = useGetCartQuery();

  const cart = cartData?.data as ICartResponse;

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    address: { street: "", city: "", governorate: "" },
    paymentMethod: "stripe",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  useEffect(() => {
    // keep for debugging during development if needed
  }, [cart, form]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    if (!form.fullName || !form.fullName.trim())
      return { valid: false, message: "الاسم الكامل مطلوب" };
    if (!form.email || !form.email.includes("@"))
      return { valid: false, message: "بريد إلكتروني صالح مطلوب" };
    if (!form.phone || !form.phone.trim())
      return { valid: false, message: "رقم الهاتف مطلوب" };
    if (!form.address) return { valid: false, message: "العنوان مطلوب" };
    if (!form.address.governorate)
      return { valid: false, message: "اختر المحافظة" };
    if (!form.address.city || !form.address.city.trim())
      return { valid: false, message: "المدينة مطلوبة" };
    if (!form.address.street || !form.address.street.trim())
      return { valid: false, message: "العنوان بالتفصيل مطلوب" };
    if (form.paymentMethod === "stripe") {
      if (!form.cardholderName || !form.cardholderName.trim())
        return { valid: false, message: "اسم حامل البطاقة مطلوب" };
      if (!form.cardNumber || form.cardNumber.replace(/\s+/g, "").length < 12)
        return { valid: false, message: "رقم بطاقة صالح مطلوب" };
      if (!form.expiryDate || !form.expiryDate.trim())
        return { valid: false, message: "تاريخ الانتهاء مطلوب" };
      if (!form.cvv || form.cvv.trim().length < 3)
        return { valid: false, message: "رمز CVV مطلوب" };
    }
    return { valid: true };
  }, [form]);

  const placeOrder = useCallback(async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      showNotification({ message: "Cart is empty", variant: "error" });
      return;
    }

    if (isLoading || isSubmitting) return; // prevent duplicate submissions

    const validation = validateForm();
    if (!validation.valid) {
      showNotification({
        message: validation.message || "الحقول غير مكتملة",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentMethodPayload =
        form.paymentMethod === "stripe" ? "card" : form.paymentMethod;

      const resp = await createOrder({
        shippingAddress: form.address,
        paymentMethod: paymentMethodPayload,
      }).unwrap();

      showNotification({
        message: "Order placed successfully",
        variant: "success",
      });
      navigate(`/orders/${resp.data.id}`);
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      showNotification({
        message:
          error?.data?.message || error?.message || "Failed to place order",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    cart,
    createOrder,
    form,
    isLoading,
    isSubmitting,
    navigate,
    validateForm,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await placeOrder();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <h1 className="mb-8">إتمام الطلب</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <CheckoutForm form={form} setForm={setForm} />
            </div>
            <div className="lg:col-span-1">
              <CheckoutSummary
                cartItems={cart}
                onConfirm={() => placeOrder()}
                isLoading={isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
