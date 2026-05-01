import { AlertCircle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IProduct } from "@/types/entities/product.types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: IProduct | null;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-4xl p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-accent-light hover:text-text-dark transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Warning Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        {/* Title & Desc */}
        <h2 className="text-2xl font-bold text-text-dark mb-2">حذف المنتج؟</h2>
        <p className="text-text-muted text-sm leading-relaxed mb-8">
          هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
        </p>

        {/* Product Preview Card */}
        <div className="w-full bg-bg-cream/50 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-accent-light/20">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-accent-light bg-white shrink-0">
            <img 
              src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start text-right flex-1">
            <h3 className="font-bold text-text-dark text-sm">{product.title}</h3>
            <span className="text-primary font-bold text-sm mt-1">{product.price} ج.م</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button
            variant="outline-accent"
            className="rounded-2xl h-12! bg-white text-text-dark border-accent-light/50 font-bold"
            onClick={onClose}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            variant="primary"
            className="rounded-2xl h-12! bg-red-500 hover:bg-red-600 border-none text-white font-bold flex items-center justify-center gap-2"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "جاري الحذف..." : "نعم، احذف"}
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
