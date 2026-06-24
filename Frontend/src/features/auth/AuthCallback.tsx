import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoginWithGoogleMutation, useSignupWithGoogleMutation } from "@/api/auth.api";
import { showNotification } from "@/utils/showNotification";
import { EUserRole } from "@/types/entities/user.types";

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const [signupWithGoogle] = useSignupWithGoogleMutation();

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const stateStr = searchParams.get("state");

    if (error) {
      showNotification({ message: "تم إلغاء عملية تسجيل الدخول أو حدث خطأ", variant: "error" });
      navigate("/auth/login", { replace: true });
      return;
    }

    if (!code) {
      showNotification({ message: "لم يتم العثور على رمز التحقق", variant: "error" });
      navigate("/auth/login", { replace: true });
      return;
    }

    let action = 'login';
    let role = undefined;

    if (stateStr) {
      try {
        const parsedState = JSON.parse(stateStr);
        action = parsedState.action || 'login';
        role = parsedState.role;
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }

    const processAuth = async () => {
      try {
        let response;
        if (action === 'login') {
          response = await loginWithGoogle({ code }).unwrap();
        } else {
          response = await signupWithGoogle({ code, role }).unwrap();
        }

        localStorage.setItem("token", response.data.token);

        const successMessage = action === 'login'
          ? "تم تسجيل الدخول باستخدام جوجل بنجاح"
          : "تم إنشاء الحساب باستخدام جوجل بنجاح";
        showNotification({ message: successMessage, variant: "success" });

        if (action === 'signup' && response.data.user.role === EUserRole.StoreOwner) {
          navigate("/store/onboarding/welcome", { replace: true });
        } else if (response.data.user.role === EUserRole.Customer) {
          navigate("/", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (err: any) {
        const defaultError = action === 'login'
          ? "حدث خطأ أثناء الدخول عبر جوجل"
          : "حدث خطأ أثناء إنشاء الحساب عبر جوجل";
        const errorMessage = err?.data?.message || err?.message || defaultError;
        showNotification({ message: errorMessage, variant: "error" });
        navigate("/auth/login", { replace: true });
      }
    };

    processAuth();
  }, [searchParams, navigate, loginWithGoogle, signupWithGoogle]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      <h2 className="text-xl font-medium text-gray-700">جاري معالجة تسجيل الدخول...</h2>
      <p className="text-sm text-gray-500">يرجى الانتظار للحظات بينما نقوم بتأكيد حسابك</p>
    </div>
  );
};
