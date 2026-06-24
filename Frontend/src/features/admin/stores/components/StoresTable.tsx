import { Store, CheckCircle, Clock, Ban, Trash2, ExternalLink, RotateCcw } from "lucide-react";
import { IStore, EStoreStatus } from "@/types/entities/store.types";
import { Link } from "react-router-dom";

interface StoresTableProps {
  stores: IStore[];
  isLoading: boolean;
  onUpdateStatus: (storeId: string, currentStatus: EStoreStatus, newStatus: EStoreStatus) => void;
  onDelete: (storeId: string) => void;
}

// ── Status Badge helpers ────────────────────────────────────────────────────── //

function getStatusBadge(status: EStoreStatus, isDeleted: boolean) {
  // If deleted, show "محذوف" badge regardless of status
  if (isDeleted) {
    return {
      label: "محذوف",
      className: "text-gray-700 bg-gray-100 border border-gray-300",
      icon: <Ban className="w-3 h-3 ml-1 inline-block" />,
    };
  }

  // Otherwise show the actual status
  switch (status) {
    case EStoreStatus.Active:
      return {
        label: "نشط",
        className: "text-emerald-700 bg-emerald-50 border border-emerald-200",
        icon: <CheckCircle className="w-3 h-3 ml-1 inline-block" />,
      };
    case EStoreStatus.Pending:
      return {
        label: "قيد المراجعة",
        className: "text-amber-700 bg-amber-50 border border-amber-200",
        icon: <Clock className="w-3 h-3 ml-1 inline-block" />,
      };
    case EStoreStatus.Suspended:
      return {
        label: "محظور",
        className: "text-red-700 bg-red-50 border border-red-200",
        icon: <Ban className="w-3 h-3 ml-1 inline-block" />,
      };
    default:
      return {
        label: "غير معروف",
        className: "text-gray-700 bg-gray-50 border border-gray-200",
        icon: null,
      };
  }
}

// ── Component ─────────────────────────────────────────────────────────────── //

export function StoresTable({ stores, isLoading, onUpdateStatus, onDelete }: StoresTableProps) {
  const handleStatusChange = (
    storeId: string,
    storeName: string,
    currentStatus: EStoreStatus,
    newStatus: EStoreStatus
  ) => {
    const statusLabels = {
      [EStoreStatus.Active]: "تفعيل",
      [EStoreStatus.Suspended]: "حظر",
      [EStoreStatus.Pending]: "وضع في قيد المراجعة",
    };

    if (
      window.confirm(
        `هل أنت متأكد من رغبتك في ${statusLabels[newStatus]} المتجر: "${storeName}"؟`
      )
    ) {
      onUpdateStatus(storeId, currentStatus, newStatus);
    }
  };

  const handleDelete = (storeId: string, storeName: string) => {
    if (
      window.confirm(
        `هل أنت متأكد من رغبتك في حذف المتجر: "${storeName}"؟\nهذا الإجراء سيؤدي إلى حذف المتجر وجميع منتجاته نهائياً.`
      )
    ) {
      onDelete(storeId);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────── //
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm font-sans select-none">
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted text-sm font-medium">
            جاري تحميل بيانات المتاجر...
          </p>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────── //
  if (stores.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-accent-light overflow-hidden shadow-sm text-center p-12 font-sans select-none">
        <Store className="w-16 h-16 mx-auto mb-4 text-accent-light" />
        <h3 className="text-base font-bold text-text-dark mb-1">
          لا توجد متاجر مطابقة للبحث
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
              <th className="py-3.5 px-4">المتجر</th>
              <th className="py-3.5 px-4">النطاق الفرعي</th>
              <th className="py-3.5 px-4">صاحب المتجر</th>
              <th className="py-3.5 px-4">الحالة</th>
              <th className="py-3.5 px-4">تاريخ الإنشاء</th>
              <th className="py-3.5 px-4 text-center">التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stores.map((store) => {
              const isDeleted = !!store.deletedAt;
              const badge = getStatusBadge(store.status, isDeleted);

              const createdDate = store.createdAt
                ? new Date(store.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—";

              return (
                <tr
                  key={store.id}
                  className={`hover:bg-bg-cream/10 transition-colors ${
                    isDeleted ? "bg-red-50/30" : ""
                  }`}
                >
                  {/* Store Name + Logo column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className={`w-9 h-9 rounded-lg object-cover border border-accent-light shrink-0 ${
                            isDeleted ? "opacity-40 grayscale" : ""
                          }`}
                        />
                      ) : (
                        <div className={`w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ${
                          isDeleted ? "opacity-40 grayscale" : ""
                        }`}>
                          <Store className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className={`font-bold truncate max-w-[180px] ${
                          isDeleted ? "line-through text-gray-500" : "text-text-dark"
                        }`}>
                          {store.name || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Subdomain column */}
                  <td className="py-4 px-4">
                    <a
                      href={`/@${store.subdomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 font-medium text-xs transition-colors ${
                        isDeleted
                          ? "text-gray-400 line-through pointer-events-none"
                          : "text-primary hover:text-primary-dark"
                      }`}
                    >
                      <span className="font-mono">{store.subdomain}</span>
                      {!isDeleted && <ExternalLink className="w-3 h-3" />}
                    </a>
                  </td>

                  {/* Owner column */}
                  <td className="py-4 px-4">
                    {store.owner?.name ? (
                      <Link
                        to={`/admin/users?search=${encodeURIComponent(store.owner.name.trim())}`}
                        className="text-primary hover:text-primary-dark font-medium text-xs hover:underline transition-colors"
                      >
                        {store.owner.name.trim()}
                      </Link>
                    ) : (
                      <span className="text-text-muted text-xs">—</span>
                    )}
                  </td>

                  {/* Status column */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.className}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  </td>

                  {/* Created date column */}
                  <td className="py-4 px-4 text-text-muted text-xs font-medium">
                    {createdDate}
                  </td>

                  {/* Actions column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {isDeleted ? (
                        // Only restore button for deleted stores
                        <button
                          onClick={() =>
                            handleStatusChange(store.id, store.name, store.status, EStoreStatus.Active)
                          }
                          className="p-1.5 text-blue-500 hover:text-white hover:bg-blue-500 rounded-md transition-colors cursor-pointer border border-transparent hover:border-blue-600"
                          title="استعادة المتجر"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          {/* Activate button (for Pending or Suspended stores) */}
                          {(store.status === EStoreStatus.Pending || store.status === EStoreStatus.Suspended) && (
                            <button
                              onClick={() =>
                                handleStatusChange(store.id, store.name, store.status, EStoreStatus.Active)
                              }
                              className="p-1.5 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-md transition-colors cursor-pointer border border-transparent hover:border-emerald-600"
                              title="تفعيل المتجر"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Suspend button (only for Active stores) */}
                          {store.status === EStoreStatus.Active && (
                            <button
                              onClick={() =>
                                handleStatusChange(store.id, store.name, store.status, EStoreStatus.Suspended)
                              }
                              className="p-1.5 text-amber-500 hover:text-white hover:bg-amber-500 rounded-md transition-colors cursor-pointer border border-transparent hover:border-amber-600"
                              title="حظر المتجر"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete button (only for non-deleted stores) */}
                          <button
                            onClick={() => handleDelete(store.id, store.name)}
                            className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-colors cursor-pointer border border-transparent hover:border-red-600"
                            title="حذف المتجر نهائياً"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
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
