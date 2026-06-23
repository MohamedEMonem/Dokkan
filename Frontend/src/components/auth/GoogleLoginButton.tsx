import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useLoginWithGoogleMutation, useSignupWithGoogleMutation } from '@/api/auth.api';
import { showNotification } from '@/utils/showNotification';
import { EUserRole } from '@/types/entities/user.types';

interface GoogleLoginButtonProps {
  role?: string;
  action: 'login' | 'signup';
}

export const GoogleLoginButton = ({ role, action }: GoogleLoginButtonProps) => {
  const navigate = useNavigate();
  const [loginWithGoogle, { isLoading: isLoginLoading }] = useLoginWithGoogleMutation();
  const [signupWithGoogle, { isLoading: isSignupLoading }] = useSignupWithGoogleMutation();

  const isLoading = isLoginLoading || isSignupLoading;

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        let response;
        if (action === 'login') {
          response = await loginWithGoogle({ code: codeResponse.code }).unwrap();
        } else {
          response = await signupWithGoogle({ code: codeResponse.code, role }).unwrap();
        }
        
        localStorage.setItem("token", response.data.token);
        
        const successMessage = action === 'login' 
          ? "تم تسجيل الدخول باستخدام جوجل بنجاح" 
          : "تم إنشاء الحساب باستخدام جوجل بنجاح";
        showNotification({ message: successMessage, variant: "success" });
        
        if (action === 'signup' && response.data.user.role === EUserRole.StoreOwner) {
          navigate("/store/onboarding/welcome");
        } else if (response.data.user.role === EUserRole.Customer) {
          navigate("/");
        } else {
          navigate("/dashboard");
        }
      } catch (error: any) {
        const defaultError = action === 'login' 
          ? "حدث خطأ أثناء الدخول عبر جوجل" 
          : "حدث خطأ أثناء إنشاء الحساب عبر جوجل";
        const errorMessage = error?.data?.message || error?.message || defaultError;
        showNotification({ message: errorMessage, variant: "error" });
      }
    },
    onError: () => {
      showNotification({ message: "فشل الاتصال بخوادم جوجل", variant: "error" });
    },
  });

  const buttonText = isLoading 
    ? (action === 'login' ? "جارٍ تسجيل الدخول..." : "جارٍ إنشاء الحساب...") 
    : (action === 'login' ? "تسجيل الدخول باستخدام جوجل" : "إنشاء حساب باستخدام جوجل");

  const isGoogleAuthConfigured = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <button
      type="button"
      onClick={() => {
        if (!isGoogleAuthConfigured) {
          showNotification({ message: "تسجيل الدخول باستخدام جوجل غير مفعل حالياً لعدم توفر مفتاح الربط", variant: "error" });
          return;
        }
        login();
      }}
      disabled={isLoading || !isGoogleAuthConfigured}
      className={`flex items-center justify-center w-full gap-3 py-3 border rounded-xl font-medium transition-colors 
        ${isGoogleAuthConfigured 
          ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-1 focus:ring-gray-200" 
          : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"} 
        disabled:opacity-50`}
    >
      {isLoading ? (
        <span className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      )}
      <span>{buttonText}</span>
    </button>
  );
};
