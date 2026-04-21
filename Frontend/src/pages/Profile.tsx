import { useState } from "react";
import {
  CircleUser,
  Camera,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Input } from "@/components/ui/Input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Profile() {
  // Read auth data from localStorage
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  // Role translation mapping
  const roleTranslation: Record<string, string> = {
    Customer: "عميل",
    StoreOwner: "بائع",
    Admin: "ادمن",
  };

  const accountTypeTranslation: Record<string, string> = {
    Customer: "حساب مشتري",
    StoreOwner: "حساب بائع",
    Admin: "حساب مدير النظام",
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "غير متوفر";

  return (
    <div className="min-h-screen flex flex-col bg-bg-warm">
      <Header />

      <main className="flex-1 py-12 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="size-16! bg-linear-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
                <CircleUser className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-text-dark mb-3">
              حسابي الشخصي
            </h1>
            <p className="text-lg text-text-muted">
              إدارة معلوماتك الشخصية وإعدادات الحساب
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Right Sidebar (Profile Info) */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border-2 border-accent-light shadow-md p-8">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="size-40! rounded-full overflow-hidden border-4 border-accent-light bg-bg-cream shadow-inner flex items-center justify-center">
                      <UserAvatar
                        name={user.name}
                        avatarUrl={user.profilePhotoUrl}
                        className="w-full h-full rounded-none"
                        textClassName="text-6xl!"
                      />
                    </div>
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-2 right-2 size-10! bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-all shadow-lg hover:scale-110"
                    >
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <h3 className="text-2xl font-bold text-text-dark mb-1">
                    {user.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">{user.email}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">
                      {roleTranslation[user.role]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Main Area */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl border-2 border-accent-light shadow-md overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-text-dark">
                      المعلومات الشخصية
                    </h2>
                    {!isEditing ? (
                      <Button
                        variant="primary"
                        onClick={() => setIsEditing(true)}
                        className="h-9! w-fit! px-8 rounded-full font-bold shadow-md hover:scale-105 transition-transform text-sm"
                      >
                        تعديل البيانات
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Button
                          variant="primary"
                          onClick={() => setIsEditing(false)}
                          className="size-h-9! w-24! bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-md transition-all text-sm"
                        >
                          حفظ
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setIsEditing(false)}
                          className="size-h-9! w-24! border-2 border-gray-200 text-text-muted hover:bg-gray-50 rounded-full font-bold transition-all text-sm"
                        >
                          إلغاء
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="الاسم الكامل"
                      icon={<CircleUser className="w-5 h-5" />}
                      disabled={!isEditing}
                      defaultValue={user.name}
                      className={
                        !isEditing ? "opacity-100 bg-gray-50/50" : "bg-white"
                      }
                    />

                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      icon={<Mail className="w-5 h-5" />}
                      disabled={!isEditing}
                      defaultValue={user.email}
                      className={
                        !isEditing ? "opacity-100 bg-gray-50/50" : "bg-white"
                      }
                    />

                    <Input
                      label="رقم الهاتف"
                      type="tel"
                      dir="rtl"
                      icon={<Phone className="w-5 h-5" />}
                      disabled={!isEditing}
                      defaultValue={user.contactNumber || ""}
                      placeholder="غير متوفر"
                      className={
                        !isEditing
                          ? "opacity-100 bg-gray-50/50 text-left"
                          : "bg-white text-left"
                      }
                    />
                  </div>
                  
                  <div className={`pt-6 border-t-2 border-accent-light mt-10 ${isEditing ? "" : "hidden"}`}>
                    <h3 className="text-lg text-text-dark mb-6 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      تغيير كلمة المرور
                    </h3>
                    <div className="space-y-6">
                      <Input
                        label="كلمة المرور الحالية"
                        type="password"
                        disabled={!isEditing}
                        placeholder="أدخل كلمة المرور الحالية"
                        className={
                          !isEditing ? "opacity-100 bg-gray-50/50" : "bg-white"
                        }
                      />

                      <Input
                        label="كلمة المرور الجديدة"
                        type="password"
                        disabled={!isEditing}
                        placeholder="أدخل كلمة المرور الجديدة"
                        className={
                          !isEditing ? "opacity-100 bg-gray-50/50" : "bg-white"
                        }
                      />

                      <Input
                        label="تأكيد كلمة المرور"
                        type="password"
                        disabled={!isEditing}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        className={
                          !isEditing ? "opacity-100 bg-gray-50/50" : "bg-white"
                        }
                      />
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="mt-10 p-5 bg-linear-to-l from-primary/5 to-accent-light/10 rounded-xl border border-primary/10 flex items-start gap-3">
                      <span className="text-xl">💡</span>
                      <p className="text-sm text-text-muted leading-relaxed">
                        لتعديل معلوماتك الشخصية، اضغط على زر
                        <span className="font-bold text-primary mx-1">
                          "تعديل البيانات"
                        </span>
                        أعلاه.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Details Footer Card */}
              <div className="bg-white rounded-2xl border-2 border-accent-light shadow-md p-6">
                <h3 className="text-lg font-bold text-text-dark mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  تفاصيل الحساب
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between p-4 bg-bg-cream rounded-xl border border-accent-light/30">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary/60" />
                      <span className="text-text-muted text-sm">
                        تاريخ الإنشاء
                      </span>
                    </div>
                    <span className="text-text-dark font-black">
                      {formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-bg-cream rounded-xl border border-accent-light/30">
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted text-sm">
                        نوع الحساب
                      </span>
                    </div>
                    <span className="text-text-dark font-black">
                      {accountTypeTranslation[user.role]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
