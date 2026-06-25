import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, Store, Check, Upload, Sparkles, Eye } from "lucide-react";
import { useGetUserStoreQuery, useUpdateStoreMutation } from "@/api/store.api";
import { showNotification } from "@/utils/showNotification";
import Header from "@/components/layout/Header/Header";

const PRIMARY_PRESETS = [
  { name: "أزرق النيل", value: "#005B7F" },
  { name: "ذهبي", value: "#C49A6C" },
  { name: "أزرق", value: "#3B82F6" },
  { name: "أخضر", value: "#10B981" },
  { name: "بنفسجي", value: "#8B5CF6" },
  { name: "أحمر", value: "#EF4444" },
  { name: "برتقالي", value: "#F59E0B" },
  { name: "وردي", value: "#EC4899" },
];

const BG_PRESETS = [
  { name: "أبيض", value: "#FFFFFF" },
  { name: "رمادي فاتح", value: "#F9FAFB" },
  { name: "أصفر فاتح", value: "#FEF3C7" },
  { name: "أزرق فاتح", value: "#DBEAFE" },
  { name: "أخضر فاتح", value: "#D1FAE5" },
  { name: "وردي فاتح", value: "#FCE7F3" },
  { name: "رمال الصحراء", value: "#EBD8B7" },
  { name: "رمادي", value: "#E5E7EB" },
];

export function Customize() {
  const navigate = useNavigate();
  const { data: storeResponse, isLoading: isLoadingStore } = useGetUserStoreQuery();
  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();

  const store = storeResponse?.data?.store;

  const [primaryColor, setPrimaryColor] = useState("#005B7F");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverBannerUrl, setCoverBannerUrl] = useState<string>("");

  useEffect(() => {
    if (store) {
      const themeSettingsData = store.themeSettings || (store as any).theme_settings;
      let settings = themeSettingsData;
      if (typeof settings === "string") {
        try {
          settings = JSON.parse(settings);
        } catch (e) {
          settings = {};
        }
      }
      const typedSettings = (settings || {}) as { primaryColor?: string; bgColor?: string };
      setPrimaryColor(typedSettings.primaryColor || "#005B7F");
      setBgColor(typedSettings.bgColor || "#FFFFFF");
      setLogoUrl(store.logoUrl || "");
      setCoverBannerUrl(store.coverBannerUrl || "");
    }
  }, [store]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification({
        message: "حجم الصورة يجب ألا يتجاوز 2 ميجابايت",
        variant: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCoverBannerUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification({
        message: "حجم اللوجو يجب ألا يتجاوز 2 ميجابايت",
        variant: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await updateStore({
        data: {
          themeSettings: {
            primaryColor,
            bgColor,
          },
          logoUrl: logoUrl || "",
          coverBannerUrl: coverBannerUrl || "",
        },
      }).unwrap();

      showNotification({
        message: "تم حفظ وتطبيق مظهر المتجر بنجاح!",
        variant: "success",
      });

      const storeSubdomain = store?.subdomain;
      if (storeSubdomain) {
        window.open(`${window.location.origin}/@${storeSubdomain}`, "_blank");
      }

      navigate("/dashboard");
    } catch (err: any) {
      showNotification({
        message: err?.data?.message || "حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.",
        variant: "error",
      });
    }
  };

  if (isLoadingStore) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-text-muted" dir="rtl">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg">جاري تحميل إعدادات مظهر المتجر...</p>
      </div>
    );
  }

  const storeName = store?.name || "متجري المميز";
  const storeDesc = store?.description || "أفضل متجر لبيع الهدايا والمنتجات المميزة";

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-bg-cream via-bg-cream to-accent-light" dir="rtl">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="w-full bg-linear-to-br from-[#FEFDFB] via-bg-cream to-accent-light rounded-3xl p-6 md:p-10 border-2 border-accent-light shadow-xl animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
              {/* Header Block */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-20 h-20 bg-linear-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-xl">
                    <Palette className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl text-text-dark font-bold mb-3">خصّص مظهر متجرك</h1>
                <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-6">اختر اللون الأساسي، الخلفية، واللوجو لمتجرك</p>
                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-accent-light">
                  <Store className="w-5 h-5 text-primary" />
                  <span className="text-text-muted">متجر:</span>
                  <strong className="text-primary text-lg">{storeName}</strong>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Controls Side */}
                <div className="space-y-8">
                  {/* 1. Primary Color Selection */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-accent-light">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">1</div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-dark">اللون الأساسي</h2>
                        <p className="text-sm text-text-muted">لون الأزرار والعناصر الرئيسية</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {PRIMARY_PRESETS.map((preset) => {
                          const isSelected = primaryColor.toLowerCase() === preset.value.toLowerCase();
                          return (
                            <button
                              key={preset.value}
                              type="button"
                              title={preset.name}
                              onClick={() => setPrimaryColor(preset.value)}
                              className="relative group focus:outline-hidden"
                            >
                              <div
                                className={`w-full aspect-square rounded-xl transition-all hover:scale-110 cursor-pointer shadow-md ${
                                  isSelected ? "ring-4 ring-primary ring-offset-2 scale-110 shadow-lg" : "hover:ring-2 hover:ring-primary"
                                }`}
                                style={{ backgroundColor: preset.value }}
                              >
                                {isSelected && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Check className="w-6 h-6 text-white drop-shadow-lg" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-center mt-1 text-text-muted truncate">{preset.name}</p>
                            </button>
                          );
                        })}
                      </div>
                      {/* Custom Color Input */}
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-accent-light">
                        <input
                          type="color"
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-accent-light"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                        <div className="flex-1">
                          <div className="text-xs text-text-muted mb-1 font-semibold">لون مخصص</div>
                          <div className="text-sm text-text-dark font-mono">{primaryColor.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Background Color Selection */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-accent-light">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-accent to-[#A67C52] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">2</div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-dark">لون الخلفية</h2>
                        <p className="text-sm text-text-muted">خلفية صفحات المتجر</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {BG_PRESETS.map((preset) => {
                          const isSelected = bgColor.toLowerCase() === preset.value.toLowerCase();
                          return (
                            <button
                              key={preset.value}
                              type="button"
                              title={preset.name}
                              onClick={() => setBgColor(preset.value)}
                              className="relative group focus:outline-hidden"
                            >
                              <div
                                className={`w-full aspect-square rounded-xl transition-all hover:scale-110 cursor-pointer shadow-md border border-gray-200 ${
                                  isSelected ? "ring-4 ring-primary ring-offset-2 scale-110 shadow-lg border-transparent" : "hover:ring-2 hover:ring-primary"
                                }`}
                                style={{ backgroundColor: preset.value }}
                              >
                                {isSelected && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Check className={`w-6 h-6 drop-shadow-lg`} style={{ color: primaryColor }} />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-center mt-1 text-text-muted truncate">{preset.name}</p>
                            </button>
                          );
                        })}
                      </div>
                      {/* Custom Color Input */}
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-accent-light">
                        <input
                          type="color"
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-accent-light"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                        />
                        <div className="flex-1">
                          <div className="text-xs text-text-muted mb-1 font-semibold">لون مخصص</div>
                          <div className="text-sm text-text-dark font-mono">{bgColor.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Cover Banner Image Selection */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-accent-light">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-dark">صورة الخلفية</h2>
                        <p className="text-sm text-text-muted">اختياري - صورة خلفية للبانر</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {coverBannerUrl ? (
                        <div className="relative w-full aspect-video max-w-75 mx-auto rounded-xl overflow-hidden border-2 border-dashed border-accent-light group">
                          <img src={coverBannerUrl} alt="Cover Banner" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                            <label className="cursor-pointer bg-white/95 hover:bg-white text-text-dark px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 transition-all">
                              تغيير
                              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleBannerUpload} />
                            </label>
                            <button
                              type="button"
                              onClick={() => setCoverBannerUrl("")}
                              className="bg-red-500/90 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 transition-all"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <div className="w-full aspect-video max-w-75 mx-auto bg-gray-50 rounded-xl border-2 border-dashed border-accent-light hover:border-primary hover:bg-gray-100 transition-all flex flex-col items-center justify-center gap-3">
                            <Upload className="w-12 h-12 text-accent" />
                            <div className="text-center">
                              <p className="text-sm text-text-dark mb-1 font-semibold">اضغط لرفع صورة خلفية</p>
                              <p className="text-xs text-text-muted">JPG, PNG, WebP (أقصى حجم: 2MB)</p>
                            </div>
                          </div>
                          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleBannerUpload} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* 4. Logo Selection */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-accent-light">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">3</div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-dark">لوجو المتجر</h2>
                        <p className="text-sm text-text-muted">اختياري - أضف شعار متجرك</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {logoUrl ? (
                        <div className="relative w-full aspect-square max-w-50 mx-auto rounded-xl overflow-hidden border-2 border-dashed border-accent-light group">
                          <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                            <label className="cursor-pointer bg-white/95 hover:bg-white text-text-dark px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 transition-all">
                              تغيير
                              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleLogoUpload} />
                            </label>
                            <button
                              type="button"
                              onClick={() => setLogoUrl("")}
                              className="bg-red-500/90 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 transition-all"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <div className="w-full aspect-square max-w-12 mx-auto bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-accent-light hover:border-primary hover:bg-gray-100 transition-all flex flex-col items-center justify-center gap-3">
                            <Upload className="w-12 h-12 text-accent" />
                            <div className="text-center">
                              <p className="text-sm text-text-dark mb-1 font-semibold">اضغط لرفع اللوجو</p>
                              <p className="text-xs text-text-muted">PNG, JPG (أقصى حجم: 2MB)</p>
                            </div>
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Save and Actions */}
                  <div className="bg-linear-to-br from-primary/5 to-accent-light/20 rounded-2xl p-6 md:p-8 border-2 border-accent-light">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">✓</div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-dark">احفظ المظهر</h2>
                        <p className="text-sm text-text-muted">طبّق التصميم على متجرك</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="w-full bg-linear-to-l from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isUpdating ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 ml-2" />
                            حفظ وتطبيق المظهر
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="w-full border-2 border-text-muted text-text-muted hover:bg-gray-100 hover:text-gray-800 py-4 rounded-xl text-lg font-bold transition-all cursor-pointer"
                      >
                        تخطي الآن
                      </button>
                      <p className="text-xs text-center text-text-muted font-semibold">💡 يمكنك تغيير المظهر لاحقاً من إعدادات المتجر</p>
                    </div>
                  </div>
                </div>

                {/* Sticky Live Preview */}
                <div className="lg:sticky lg:top-8 h-fit">
                  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-accent-light">
                    <div className="flex items-center gap-3 mb-6">
                      <Eye className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold text-text-dark">معاينة مباشرة</h2>
                      <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap bg-[#22C55E] text-white mr-auto">⚡ مباشر</span>
                    </div>

                    {/* Dynamic Styled Container */}
                    <div
                      className="border-2 rounded-xl p-6 transition-all duration-300 shadow-inner"
                      style={{ backgroundColor: bgColor, borderColor: "rgb(229, 231, 235)" }}
                    >
                      {/* Store Header Banner */}
                      <div
                        className="rounded-xl p-5 shadow-lg mb-5 relative overflow-hidden transition-all duration-300"
                        style={{
                          backgroundColor: primaryColor,
                          backgroundImage: coverBannerUrl ? `url(${coverBannerUrl})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                      >
                        {/* Banner overlay for readability if image is uploaded */}
                        {coverBannerUrl && <div className="absolute inset-0 bg-black/40 z-0"></div>}

                        <div className="flex items-center gap-3 relative z-10">
                          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
                            {logoUrl ? (
                              <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-7 h-7" style={{ color: primaryColor }} />
                            )}
                          </div>
                          <div className="flex-1 text-white">
                            <h3 className="text-xl font-bold mb-1 drop-shadow-md">{storeName}</h3>
                            <p className="text-white/90 text-xs line-clamp-1 drop-shadow-sm">{storeDesc}</p>
                          </div>
                        </div>
                      </div>

                      {/* Product Grid Sample */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Card 1 */}
                        <div className="bg-white border-2 border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="aspect-square bg-linear-to-br from-gray-50 to-gray-100 rounded-lg mb-2 flex items-center justify-center">
                            <Store className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-xs text-text-dark font-bold mb-1 line-clamp-1">منتج مميز</p>
                          <p className="text-sm font-bold mb-2 transition-all duration-300" style={{ color: primaryColor }}>299 ج.م</p>
                          <button
                            type="button"
                            className="w-full rounded-lg text-white text-xs font-semibold py-2.5 transition-all shadow-xs hover:shadow-md"
                            style={{ backgroundColor: primaryColor }}
                          >
                            أضف للسلة
                          </button>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white border-2 border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="aspect-square bg-linear-to-br from-gray-50 to-gray-100 rounded-lg mb-2 flex items-center justify-center">
                            <Store className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-xs text-text-dark font-bold mb-1 line-clamp-1">عرض خاص</p>
                          <p className="text-sm font-bold mb-2 transition-all duration-300" style={{ color: primaryColor }}>499 ج.م</p>
                          <button
                            type="button"
                            className="w-full rounded-lg text-white text-xs font-semibold py-2.5 transition-all shadow-xs hover:shadow-md"
                            style={{ backgroundColor: primaryColor }}
                          >
                            أضف للسلة
                          </button>
                        </div>
                      </div>

                      {/* Badges Footer */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center shadow-xs">
                          <p className="text-[10px] text-text-muted font-semibold">شحن مجاني</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center shadow-xs">
                          <p className="text-[10px] text-text-muted font-semibold">دفع آمن</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center shadow-xs">
                          <p className="text-[10px] text-text-muted font-semibold">دعم 24/7</p>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Info Tip */}
                    <div className="mt-4 p-3 bg-linear-to-l rounded-lg" style={{ backgroundColor: `${primaryColor}0d` }}>
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                        <p className="text-xs text-text-muted font-medium leading-relaxed">
                          التغييرات تظهر مباشرة - جرب تغيير اللون أو رفع لوجو!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
