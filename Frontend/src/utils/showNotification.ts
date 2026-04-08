import { toast, type ToastOptions } from "react-toastify";
import {
  type NotificationProps,
  variantStyles,
  CustomCloseButton,
  VariantIcon,
} from "../components/ui/Notification";

const baseOptions: ToastOptions = {
  position: "top-center",
  theme: "dark",
  rtl: true,
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  hideProgressBar: true,
};

export const showNotification = ({ message, variant = "success", options }: NotificationProps) => {
  toast(
    message, {
    ...baseOptions,
    ...options,
    icon: VariantIcon({ variant }),
    closeButton: (props) => CustomCloseButton({ ...props, type: variant }),
    className: `${variantStyles[variant]} ${options?.className ?? ""}`.trim(),
  });
};
