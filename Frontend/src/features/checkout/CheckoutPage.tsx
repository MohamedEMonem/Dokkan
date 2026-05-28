import React, { useState, useCallback } from "react";
import CheckoutForm from "@/features/checkout/CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@/api/order.api";
import { showNotification } from "@/utils/showNotification";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/features/checkout/schemas/checkout.schema";

const EMPTY_CART = {
  items: [],
  itemsTotal: 0,
  shippingEstimate: 0,
  tax: 0,
  grandTotal: 0,
};

const INITIAL_FORM: CheckoutFormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: { street: "", city: "", governorate: "" },
  paymentMethod: "stripe",
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [form, setForm] = useState<CheckoutFormValues>(INITIAL_FORM);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const validationResult = checkoutSchema.safeParse(form);

    if (!validationResult.success) {
      return {
        valid: false,
        message:
          validationResult.error.issues[0]?.message || "الحقول غير مكتملة",
      };
    }

    return { valid: true };
  }, [form]);

  const placeOrder = useCallback(async () => {
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
      const resp = await createOrder({
        username: form.fullName,
        phoneNumber: form.phone,
        email: form.email,
        shippingAddress: {
          line1: form.address.street,
          line2: form.address.governorate,
          city: form.address.city,
          country: "Egypt",
        },
      }).unwrap();

      showNotification({
        message: "Order placed successfully",
        variant: "success",
      });
      const firstOrderId = resp.data.orders[0]?.id;
      navigate(firstOrderId ? `/orders/${firstOrderId}` : "/orders");
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
    // cart,
    createOrder,
    form,
    isLoading,
    isSubmitting,
    navigate,
    validateForm,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await placeOrder();
    },
    [placeOrder],
  );

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
              <CheckoutSummary cartItems={EMPTY_CART} isLoading={isLoading} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
