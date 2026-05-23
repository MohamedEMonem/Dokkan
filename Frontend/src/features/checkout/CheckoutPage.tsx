import React, { useState, useCallback } from "react";
// import { useGetCartQuery } from "@/api/cart.api";
import CheckoutForm from "@/features/checkout/CheckoutForm";
// import type { ICartResponse } from "@/types/entities/cart.types";
import CheckoutSummary from "./CheckoutSummary";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@/api/order.api";
import { showNotification } from "@/utils/showNotification";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/features/checkout/schemas/checkout.schema";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  // const { data: cartData } = useGetCartQuery();

  // const cart = cartData?.data as ICartResponse;

  const emptyCart = {
    items: [],
    itemsTotal: 0,
    shippingEstimate: 0,
    tax: 0,
    grandTotal: 0,
  };

  const [form, setForm] = useState<CheckoutFormValues>({
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
  // useEffect(() => {
  //   // keep for debugging during development if needed
  // }, [cart, form]);

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
    // if (!cart || !cart.items || cart.items.length === 0) {
    //   showNotification({ message: "Cart is empty", variant: "error" });
    //   return;
    // }

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
    // cart,
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
                cartItems={emptyCart}
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
