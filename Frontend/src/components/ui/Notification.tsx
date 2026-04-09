import { Check, X } from "lucide-react";
import clsx from "clsx";
import {
  ToastContainer,
  type ToastContent,
  type ToastOptions,
  type CloseButtonProps,
} from "react-toastify";

/* ────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────── */
const baseIconClass = "flex h-5 w-5 items-center justify-center rounded-full";

const baseCloseButtonClass =
  `
  absolute -top-2 -right-2 flex h-5 w-5 
  cursor-pointer items-center justify-center 
  border rounded-full transition 
  hover:opacity-80
  md:-right-2 md:-top-2
  `;
const baseNotificationClass = "font-semibold shadow-md px-3 py-2";

export const variantClasses = {
  success: {
    iconCircle: "bg-green-400",
    iconText: "text-emerald-950",
    closeButton:
      "border-emerald-500 bg-emerald-950 text-emerald-500 hover:bg-emerald-900",
  },
  error: {
    iconCircle: "bg-red-400",
    iconText: "text-red-950",
    closeButton: "border-red-500 bg-red-950 text-red-500 hover:bg-red-900",
  },
} as const;

export const variantStyles: Record<
  NotificationVariant,
  NonNullable<ToastOptions["className"]>
> = {
  success: clsx(
    baseNotificationClass,
    "bg-emerald-950 border border-emerald-900 !text-green-400",
  ),
  error: clsx(
    baseNotificationClass,
    "bg-red-950 border border-red-900 !text-red-400",
  ),
};

/* ────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────── */
export type NotificationVariant = "success" | "error";

export interface NotificationProps {
  message: ToastContent;
  variant?: NotificationVariant;
  options?: ToastOptions;
}

export interface CustomCloseButtonProps extends CloseButtonProps {
  type: NotificationVariant;
}

/* ────────────────────────────────────────────────────────
 * Component helpers
 * ──────────────────────────────────────────────────────── */
export const CustomCloseButton = ({
  closeToast,
  type,
}: CustomCloseButtonProps) => {
  const ariaLabel =
    type === "success" ? "إغلاق رسالة النجاح" : "إغلاق رسالة الخطأ";

  return (
    <button
      onClick={() => closeToast?.()}
      type="button"
      aria-label={ariaLabel}
      className={clsx(baseCloseButtonClass, variantClasses[type].closeButton)}
    >
      <X size={12} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
};

export const VariantIcon = ({ variant }: { variant: NotificationVariant }) => {
  const Icon = variant === "success" ? Check : X;
  const ariaLabel = variant === "success" ? "نجاح" : "خطأ";

  return (
    <div
      className={clsx(baseIconClass, variantClasses[variant].iconCircle)}
      role="img"
      aria-label={ariaLabel}
    >
      <Icon
        size={14}
        strokeWidth={3}
        className={variantClasses[variant].iconText}
        aria-hidden="true"
      />
    </div>
  );
};

/* ────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────── */
export const Notification = () => (
  <ToastContainer
    position="top-center"
    theme="dark"
    rtl
    newestOnTop
  />
);
