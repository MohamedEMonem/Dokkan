import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Package,
  MessageSquare,
  Flag,
  Layers,
  CreditCard,
  Users,
  User,
  LogOut,
  X,
} from "lucide-react";
import { IUser } from "@/types/entities/user.types";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface AdminSidebarProps {
  user?: IUser;
  onClose?: () => void;
}

const adminNavLinks = [
  { name: "نظرة عامة", path: "/admin", icon: LayoutDashboard, end: true },
  { name: "إدارة المتاجر", path: "/admin/stores", icon: Store, end: false },
  { name: "إدارة المنتجات", path: "/admin/products", icon: Package, end: false },
  { name: "التعليقات والتقييمات", path: "/admin/reviews", icon: MessageSquare, end: false },
  { name: "طلبات الإبلاغ", path: "/admin/flags", icon: Flag, end: false },
  { name: "إدارة التصنيفات", path: "/admin/categories", icon: Layers, end: false },
  { name: "خطط الاشتراك", path: "/admin/plans", icon: CreditCard, end: false },
  { name: "إدارة المستخدمين", path: "/admin/users", icon: Users, end: false },
  { name: "الملف الشخصي", path: "/profile", icon: User, end: false },
];

export function AdminSidebar({ user, onClose }: AdminSidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col h-full bg-primary-dark text-white select-none">
      {/* Sidebar Header / Branding */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-primary shadow-md">
            <Store className="w-5 h-5 text-primary-dark" />
          </div>
          <span className="font-bold text-lg tracking-wide bg-linear-to-l from-white to-accent-light bg-clip-text text-transparent">
            دكان لوحة المدير
          </span>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto filter-scrollbar">
        {adminNavLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                isActive
                  ? "bg-white/10 text-accent font-semibold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-accent" : "text-white/60 group-hover:text-white"
                  }`}
                />
                <span>{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile Area */}
      {user && (
        <div className="p-4 border-t border-white/10 bg-black/10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={user.name}
              avatarUrl={user.profilePhotoUrl}
              className="w-10 h-10 border border-white/20 shadow-sm shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate text-white">{user.name}</p>
              <p className="text-xs text-white/50 truncate font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white transition-all duration-200 cursor-pointer border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );
}
