import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Menu, Clock } from "lucide-react";
import { IUser } from "@/types/entities/user.types";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface AdminHeaderProps {
  user?: IUser;
  onMenuClick: () => void;
}

const routeTitles: Record<string, string> = {
  "/admin": "نظرة عامة على المنصة",
  "/admin/stores": "إدارة متاجر المنصة",
  "/admin/products": "إدارة المنتجات العامة",
  "/admin/reviews": "مراجعة التعليقات والتقييمات",
  "/admin/flags": "طلبات الإبلاغ والاعتدال",
  "/admin/categories": "إدارة تصنيفات المنتجات",
  "/admin/plans": "خطط الاشتراك والأسعار",
  "/admin/users": "إدارة حسابات المستخدمين",
};

export function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
  const location = useLocation();
  const currentTitle = routeTitles[location.pathname] || "لوحة التحكم";
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for live clock
    return () => clearInterval(timer);
  }, []);

  // Format time in Egyptian locale, e.g. "10:30:15 م"
  const formattedTime = currentTime.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Format date, e.g. "الأربعاء، ٢٤ يونيو ٢٠٢٦"
  const formattedDate = currentTime.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-16 bg-white border-b-2 border-accent-light px-4 md:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30 select-none">
      {/* Right Side: Toggle Sidebar & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-dark hover:text-primary hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Navigation Title */}
        <h1 className="text-base md:text-lg font-bold text-text-dark font-sans tracking-wide">
          {currentTitle}
        </h1>
      </div>

      {/* Left Side: Date/Time, Notifications & User Greeting */}
      <div className="flex items-center gap-3.5">
        {/* Live Clock Display */}
        <div className="hidden md:flex items-center gap-2 text-xs text-text-muted bg-bg-cream border border-accent-light/60 px-3 py-1.5 rounded-xl font-medium">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>
            {formattedDate} | {formattedTime}
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="tertiary"
            icon={<Bell className="w-5 h-5" />}
            className="p-2.5 rounded-xl text-text-dark hover:bg-bg-cream transition-colors"
            aria-label="التنبيهات"
          >
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              2
            </span>
          </Button>
        </div>

        {/* Vertical Separator */}
        <span className="h-6 w-px bg-gray-200" />

        {/* User Info (Purely visual welcome, no navigation dropdown) */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-text-muted font-medium">مرحباً بك</p>
              <p className="text-xs font-bold text-text-dark mt-0.5 leading-none">
                {user.name}
              </p>
            </div>
            <UserAvatar
              name={user.name}
              avatarUrl={user.profilePhotoUrl}
              className="w-9 h-9 border border-accent-light shadow-xs"
            />
          </div>
        )}
      </div>
    </header>
  );
}
