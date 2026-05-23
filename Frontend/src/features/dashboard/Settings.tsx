import { useState, useEffect } from "react";
import { Settings as SettingsIcon, CheckCircle } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { showNotification } from "@/utils/showNotification";
import { useGetProfileQuery } from "@/api/user.api";
import { useGetUserStoreQuery } from "@/api/store.api";

export function Settings() {
  const token = localStorage.getItem("token");
  
  const { data: profileResponse, isLoading: isLoadingProfile } = useGetProfileQuery(undefined, { skip: !token });
  const { data: storeResponse, isLoading: isLoadingStore } = useGetUserStoreQuery(undefined, { skip: !token });

  const user = profileResponse?.data?.user;
  const store = storeResponse?.data?.store;

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Pre-fill data
  useEffect(() => {
    if (store) {
      setStoreName(store.name || "");
      setDescription(store.description || "");
      setPhone(store.phoneNumber || "");
      setAddress(store.businessAddress || "");
    }
  }, [store]);

  useEffect(() => {
    if (user) {
      setOwnerName(user.name || "");
      if (!store?.phoneNumber && user.contactNumber) {
        setPhone(prev => prev || user.contactNumber || "");
      }
    }
  }, [user, store?.phoneNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just simulate a successful save
    showNotification({
      message: "تم حفظ التغييرات بنجاح! (معاينة تجريبية)",
      variant: "success",
    });
    
    console.log("Store Settings Saved:", {
      storeName,
      description,
      ownerName,
      phone,
      address,
    });
  };

  const handleCancel = () => {
    setStoreName(store?.name || "");
    setDescription(store?.description || "");
    setOwnerName(user?.name || "");
    setPhone( user?.contactNumber || store?.phoneNumber || "");
    setAddress(store?.businessAddress || "");
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500" dir="rtl">
      <DashboardCard
        title="إعدادات المتجر"
        icon={<SettingsIcon className="w-6 h-6 text-primary" />}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="اسم المتجر *"
            placeholder="أدخل اسم المتجر"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className="h-12!"
          />

          <TextArea
            label="وصف المتجر *"
            placeholder="أدخل وصف تفصيلي عن متجرك"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="min-h-32!"
          />

          <Input
            label="اسم صاحب المتجر *"
            placeholder="أدخل اسم صاحب المتجر"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
            className="h-12!"
          />

          <Input
            label="رقم الهاتف *"
            type="tel"
            placeholder="+20 100 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="h-12! text-right"
          />

          <Input
            label="العنوان *"
            placeholder="أدخل عنوان المتجر"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="h-12!"
          />

          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              variant="outline-accent"
              className="h-12! px-6 rounded-xl bg-white text-text-dark hover:bg-bg-cream border-accent-light w-auto!"
              onClick={handleCancel}
            >
              إلغاء
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="h-12! px-6 rounded-xl flex items-center justify-center gap-2 w-auto!"
              icon={<CheckCircle className="w-5 h-5 ml-2" />}
            >
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </DashboardCard>
    </div>
  );
}
