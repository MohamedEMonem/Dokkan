import { useState, useEffect } from "react";
import { Settings as SettingsIcon, CheckCircle } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { showNotification } from "@/utils/showNotification";
import { useGetUserStoreQuery, useUpdateStoreMutation } from "@/api/store.api";
import { useNavigate } from "react-router-dom";

export function Settings() {
  const token = localStorage.getItem("token");

  const { data: storeResponse, isLoading: isLoadingStore } = useGetUserStoreQuery(undefined, { skip: !token });

  const [updateStore, { isLoading: isUpdatingStore }] = useUpdateStoreMutation();

  const store = storeResponse?.data?.store;

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (store) {
      setStoreName(store.name);
      setDescription(store.description!);
      setPhone(store.phoneNumber || "");
      setAddress(store.businessAddress!);
    }
  }, [store]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await Promise.all([
        updateStore({
          data: {
            name: storeName,
            description,
            businessAddress: address,
            phoneNumber: phone,
          },
        }).unwrap()
      ]);

      showNotification({
        message: "تم حفظ التغييرات بنجاح!",
        variant: "success",
      });
      navigate("/dashboard");
    } catch (err: any) {
      showNotification({
        message:
          err?.data?.message ||
          "حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.",
        variant: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500" dir="rtl">
      <DashboardCard
        title="إعدادات المتجر"
        icon={<SettingsIcon className="w-6 h-6 text-primary" />}
      >
        {isLoadingStore ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>جاري تحميل إعدادات المتجر...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="اسم المتجر *"
              placeholder="أدخل اسم المتجر"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="h-12!"
              disabled={isUpdatingStore}
            />

            <TextArea
              label="وصف المتجر *"
              placeholder="أدخل وصف تفصيلي عن متجرك"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="min-h-32!"
              disabled={isUpdatingStore}
            />

            <Input
              label="رقم الهاتف *"
              type="tel"
              placeholder="+20 100 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="h-12! text-right"
              disabled={isUpdatingStore}
            />

            <Input
              label="العنوان *"
              placeholder="أدخل عنوان المتجر"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="h-12!"
              disabled={isUpdatingStore}
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
              <Button
                type="button"
                variant="outline-accent"
                className="h-12! px-6 rounded-xl bg-white text-text-dark hover:bg-bg-cream border-accent-light w-full sm:w-auto!"
                onClick={handleCancel}
                disabled={isUpdatingStore}
              >
                إلغاء
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="h-12! px-6 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto!"
                icon={
                  isUpdatingStore ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  ) : (
                    <CheckCircle className="w-5 h-5 ml-2" />
                  )
                }
                disabled={isUpdatingStore}
              >
                {isUpdatingStore ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        )}
      </DashboardCard>
    </div>
  );
}
