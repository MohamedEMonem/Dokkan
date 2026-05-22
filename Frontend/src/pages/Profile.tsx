import { useState } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { EUserRole } from "@/types/entities/user.types";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} from "@/api/user.api";
import { showNotification } from "@/utils/showNotification";
import { updateProfileSchema, UpdateProfileFormValues } from "@/schemas/profile.schema";


export default function Profile() {
  const token = localStorage.getItem("token");
  const { data: profileResponse } = useGetProfileQuery(undefined, { skip: !token });
  const user = profileResponse!.data!.user;

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: user.name || "",
      contactNumber: user.contactNumber || "",
    },
  });


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

  const onSubmit = async (data: UpdateProfileFormValues) => {
    try {
      await updateProfile({
        name: data.name,
        contactNumber: data.contactNumber === "" ? null : data.contactNumber,
      }).unwrap();
      setIsEditing(false);
      showNotification({
        message: "تم تحديث البيانات بنجاح",
        variant: "success",
      });
    } catch (error: any) {
      showNotification({
        message: error?.data?.message || "فشل تحديث البيانات",
        variant: "error",
      });
    }
  };

  const handleCancel = () => {
    reset({
      name: user.name || "",
      contactNumber: user.contactNumber || "",
    });
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await updateProfile(formData).unwrap();
      showNotification({
        message: "تم تحديث الصورة الشخصية بنجاح",
        variant: "success",
      });
    } catch (error: any) {
      showNotification({
        message: error?.data?.message || "فشل تحديث الصورة الشخصية",
        variant: "error",
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "هل أنت متأكد تماماً من رغبتك في حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء."
    );
    if (!confirmDelete) return;

    try {
      await deleteAccount().unwrap();
      showNotification({
        message: "تم حذف الحساب بنجاح",
        variant: "success",
      });
      localStorage.removeItem("token");
    } catch (error: any) {
      showNotification({
        message: error?.data?.message || "فشل حذف الحساب",
        variant: "error",
      });
    }
  };

  return (
    <div className={clsx(
      "min-h-screen flex flex-col",
      user.role === EUserRole.Customer && "bg-linear-to-br from-bg-cream via-bg-cream to-accent-light"
    )}>

      <main className="flex-1 py-8 sm:py-12 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="size-16! bg-linear-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
                <CircleUser className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-3">
              حسابي الشخصي
            </h1>
            <p className="text-base sm:text-lg text-text-muted">
              إدارة معلوماتك الشخصية وإعدادات الحساب
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Right Sidebar (Profile Info) */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border-2 border-accent-light shadow-md p-6 sm:p-8">
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
                      className={clsx(
                        "absolute bottom-2 right-2 size-10! bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-all shadow-lg hover:scale-110",
                        isUpdating && "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={isUpdating}
                      />
                    </label>
                  </div>
                  <h3 className="text-2xl font-bold text-text-dark mb-1">
                    {user.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">{user.email}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
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
                <div className="p-5 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-xl sm:text-2xl font-bold text-text-dark">
                      المعلومات الشخصية
                    </h2>
                    {!isEditing ? (
                      <Button
                        variant="primary"
                        onClick={() => setIsEditing(true)}
                        className="h-9! w-full sm:w-fit! px-8 rounded-full font-bold shadow-md hover:scale-105 transition-transform text-sm"
                      >
                        تعديل البيانات
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                          variant="primary"
                          onClick={handleSubmit(onSubmit)}
                          disabled={isUpdating}
                          className="h-9! flex-1 sm:w-24! bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-md transition-all text-sm"
                        >
                          {isUpdating ? "حفظ..." : "حفظ"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleCancel}
                          disabled={isUpdating}
                          className="h-9! flex-1 sm:w-24! border-2 border-gray-200 text-text-muted hover:bg-gray-50 rounded-full font-bold transition-all text-sm"
                        >
                          إلغاء
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Input
                        label="الاسم الكامل"
                        icon={<CircleUser className="w-5 h-5" />}
                        disabled={!isEditing || isUpdating}
                        className={
                          !isEditing ? "opacity-100 bg-gray-50/50" : "bg-white"
                        }
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      icon={<Mail className="w-5 h-5" />}
                      disabled={true}
                      defaultValue={user.email}
                      className="opacity-100 bg-gray-50/50 cursor-not-allowed"
                    />

                    <div>
                      <Input
                        label="رقم الهاتف"
                        type="tel"
                        dir="rtl"
                        icon={<Phone className="w-5 h-5" />}
                        disabled={!isEditing || isUpdating}
                        placeholder="غير متوفر"
                        className={
                          !isEditing
                            ? "opacity-100 bg-gray-50/50 text-left"
                            : "bg-white text-left"
                        }
                        {...register("contactNumber")}
                      />
                      {errors.contactNumber && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.contactNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`pt-6 border-t-2 border-accent-light mt-10 ${isEditing ? "" : "hidden"}`}
                  >
                    <h3 className="text-lg text-text-dark mb-6 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      تغيير كلمة المرور
                    </h3>
                    <div className="space-y-6">
                      <Input
                        label="كلمة المرور الحالية"
                        type="password"
                        disabled={!isEditing || isUpdating}
                        placeholder="أدخل كلمة المرور الحالية"
                        className={
                          !isEditing ? "opacity-100 bg-gray-50/50" : "bg-white"
                        }
                      />

                      <Input
                        label="كلمة المرور الجديدة"
                        type="password"
                        disabled={!isEditing || isUpdating}
                        placeholder="أدخل كلمة المرور الجديدة"
                        className={
                          !isEditing ? "opacity-100 bg-gray-50/50" : "bg-white"
                        }
                      />

                      <Input
                        label="تأكيد كلمة المرور"
                        type="password"
                        disabled={!isEditing || isUpdating}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between p-4 bg-bg-cream rounded-xl border border-accent-light/30 gap-y-2">
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
                  <div className="flex flex-wrap items-center justify-between p-4 bg-bg-cream rounded-xl border border-accent-light/30 gap-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted text-sm">
                        نوع الحساب
                      </span>
                    </div>
                    <span className="text-text-dark font-black text-xs sm:text-sm">
                      {accountTypeTranslation[user.role]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danger Zone / Delete Account Card */}
              <div className="bg-red-50/50 rounded-2xl border-2 border-red-100 shadow-md p-6">
                <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                  حذف الحساب
                </h3>
                <p className="text-sm text-red-600 mb-6 leading-relaxed">
                  حذف الحساب سيؤدي إلى مسح كافة بياناتك الشخصية وتفاصيل حسابك بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
                </p>
                <Button
                  variant="primary"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full sm:w-fit! bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-md hover:scale-105 transition-all text-sm px-8 py-2"
                >
                  {isDeleting ? "جاري حذف الحساب..." : "حذف الحساب نهائياً"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
