import { Users, Trash2, ShieldCheck, Store, User } from "lucide-react";
import { IUser, EUserRole } from "@/types/entities/user.types";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface UsersTableProps {
  users: IUser[];
  isLoading: boolean;
  onDelete: (userId: string) => void;
}

// ── Role Badge helpers ────────────────────────────────────────────────────── //

function getRoleBadge(role: string) {
  switch (role) {
    case EUserRole.Admin:
      return {
        label: "مدير",
        className: "text-violet-700 bg-violet-50 border border-violet-200",
        icon: <ShieldCheck className="w-3 h-3 ml-1 inline-block" />,
      };
    case EUserRole.StoreOwner:
      return {
        label: "صاحب متجر",
        className: "text-blue-700 bg-blue-50 border border-blue-200",
        icon: <Store className="w-3 h-3 ml-1 inline-block" />,
      };
    default:
      return {
        label: "عميل",
        className: "text-emerald-700 bg-emerald-50 border border-emerald-200",
        icon: <User className="w-3 h-3 ml-1 inline-block" />,
      };
  }
}

// ── Component ─────────────────────────────────────────────────────────────── //

export function UsersTable({ users, isLoading, onDelete }: UsersTableProps) {
  const handleDelete = (userId: string, userName: string | null) => {
    if (
      window.confirm(
        `هل أنت متأكد من رغبتك في حذف حساب المستخدم: "${userName || userId}"؟\nهذا الإجراء سيؤدي إلى تعطيل الحساب نهائياً.`,
      )
    ) {
      onDelete(userId);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────── //
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm font-sans select-none">
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted text-sm font-medium">
            جاري تحميل بيانات المستخدمين...
          </p>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────── //
  if (users.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm text-center p-12 font-sans select-none">
        <Users className="w-16 h-16 mx-auto mb-4 text-accent-light" />
        <h3 className="text-base font-bold text-text-dark mb-1">
          لا توجد حسابات مطابقة للبحث
        </h3>
        <p className="text-text-muted text-xs">
          حاول تغيير خيارات التصفية أو البحث بكلمة أخرى.
        </p>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────────────────── //
  return (
    <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm font-sans select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b-2 border-accent-light text-text-muted bg-bg-cream/40 font-bold">
              <th className="py-3.5 px-4">المستخدم</th>
              <th className="py-3.5 px-4">البريد الإلكتروني</th>
              <th className="py-3.5 px-4">الدور</th>
              <th className="py-3.5 px-4">الحالة</th>
              <th className="py-3.5 px-4">تاريخ التسجيل</th>
              <th className="py-3.5 px-4 text-center">التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const badge = getRoleBadge(user.role);

              const joinDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—";

              const isVerified = user.isVerified;

              return (
                <tr
                  key={user.id}
                  className="hover:bg-bg-cream/10 transition-colors"
                >
                  {/* Avatar + Name column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={user.name}
                        avatarUrl={user.profilePhotoUrl ?? undefined}
                        className="w-9 h-9 shrink-0 text-sm"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-text-dark truncate max-w-[180px]">
                          {user.name || "—"}
                        </p>
                        {user.contactNumber && (
                          <p className="text-[10px] text-text-muted truncate">
                            {user.contactNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email column */}
                  <td className="py-4 px-4 text-text-muted font-medium">
                    <span className="font-mono text-xs">{user.email}</span>
                  </td>

                  {/* Role column */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.className}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  </td>

                  {/* Verified / Status column */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isVerified
                          ? "text-emerald-700 bg-emerald-100/50"
                          : "text-amber-600 bg-amber-50 border border-amber-100"
                      }`}
                    >
                      {isVerified ? "موثق ✓" : "غير موثق"}
                    </span>
                  </td>

                  {/* Join date column */}
                  <td className="py-4 px-4 text-text-muted text-xs font-medium">
                    {joinDate}
                  </td>

                  {/* Actions column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Only allow deleting Customers & StoreOwners, not other Admins */}
                      {user.role !== EUserRole.Admin ? (
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-colors cursor-pointer border border-transparent hover:border-red-600"
                          title="حذف الحساب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span
                          className="p-1.5 text-gray-300 cursor-not-allowed"
                          title="لا يمكن حذف حسابات المدراء"
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
