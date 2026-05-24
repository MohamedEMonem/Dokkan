import { memo, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ICartResponseItem } from "@/types/entities/cart.types";

type CartItemRowProps = {
  item: ICartResponseItem;
  onIncrease: (productId: string, currentQty: number) => void;
  onDecrease: (productId: string, currentQty: number) => void;
  onRemove: (productId: string) => void;
};

function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  const decreaseDisabled = useMemo(() => item.quantity <= 1, [item.quantity]);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex gap-4">
        <Link to={`/products/${item.productId}`}>
          <div className="w-24 h-24 bg-white rounded-lg overflow-hidden border border-gray-200">
            <img
              src={item.imageUrl ?? undefined}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        <div className="flex-1">
          <Link to={`/products/${item.productId}`}>
            <h4 className="mb-1 hover:text-blue-600 text-text-dark">
              {item.title}
            </h4>
          </Link>

          <div className="text-lg text-primary mb-4">
            {item.unitPrice?.toFixed(2)} ج.م
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-lg bg-white border-gray-300">
              <Button
                variant="outline-accent"
                className={`w-9! h-8! border-none! ${decreaseDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => onDecrease(item.productId, item.quantity)}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <span className="px-4 py-1 min-w-12 text-center inline-block">
                {item.quantity}
              </span>

              <Button
                variant="outline-accent"
                className="w-9! h-8! border-none!"
                onClick={() => onIncrease(item.productId, item.quantity)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button
              className="w-20! px-3! h-8! text-red-500 hover:bg-red-50! border-red-500!"
              icon={<Trash2 className="w-4 h-4" />}
              variant="tertiary"
              onClick={() => onRemove(item.productId)}
            >
              حذف
            </Button>
          </div>
        </div>

        <div className="text-left">
          <div className="text-lg text-text-dark">
            {item.lineTotal?.toFixed(2)} ج.م
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CartItemRow);
