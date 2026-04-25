import { Store, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DashboardHeaderProps {
  userName: string;
  storeName: string;
}

export function DashboardHeader({ userName, storeName }: DashboardHeaderProps) {
  return (
    <header className="bg-linear-to-l from-primary to-primary-light text-white py-8 px-4 shadow-lg">
      <div className="container mx-auto">
        {/* Top Row: User Info + Actions */}
        <div className="flex items-center justify-between mb-6">
          {/* Right Section: User & Store Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg">
              <Store className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">مرحباً، {userName}</h1>
              <p className="text-white/90 text-lg">
                لوحة تحكم البائع - {storeName}
              </p>
            </div>
          </div>

          {/* Left Section: Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="tertiary"
                icon={<Bell className="w-6 h-6" />}
                className="relative p-3 rounded-xl text-white hover:bg-white/10"
              >
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>

            {/* Create Store CTA */}
            <Button
              variant="accent"
              icon={<Sparkles className="w-5 h-5" />}
              iconPos="right"
              className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
            >
              إنشاء متجري
            </Button>
          </div>
        </div>

        {/* Stats Cards Area — reserved for dashboard stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stat cards will be rendered here via the Outlet / page */}
        </div>
      </div>
    </header>
  );
}
