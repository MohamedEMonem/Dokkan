import { memo, useCallback, useMemo } from "react";
import type { ICartStore } from "@/types/entities/cart.types";
import CartStoreHeader from "./CartStoreHeader";
import CartItemRow from "./CartItemRow";
import CartStoreTotals from "./CartStoreTotals";

type CartStoreCardProps = {
  store: ICartStore;
  shippingFee: number;
  taxRate: number;
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
};

function CartStoreCard({
  store,
  shippingFee,
  taxRate,
  onQtyChange,
  onRemove,
}: CartStoreCardProps) {
  const increaseQty = useCallback(
    (productId: string, currentQty: number) => {
      const newQty = currentQty + 1;
      onQtyChange(productId, newQty);
    },
    [onQtyChange],
  );

  const decreaseQty = useCallback(
    (productId: string, currentQty: number) => {
      if (currentQty <= 1) return;
      const newQty = currentQty - 1;
      onQtyChange(productId, newQty);
    },
    [onQtyChange],
  );

  const storeTotalWithoutTax = useMemo(
    () => store.items.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0),
    [store.items],
  );

  const itemCount = useMemo(
    () => store.items.reduce((sum, item) => sum + item.quantity, 0),
    [store.items],
  );

  const tax = useMemo(
    () => storeTotalWithoutTax * taxRate,
    [storeTotalWithoutTax, taxRate],
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <CartStoreHeader
        storeId={store.storeId}
        storeName={store.storeName}
        itemCount={itemCount}
      />

      <div className="p-4 space-y-3">
        {store.items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            onRemove={onRemove}
          />
        ))}
      </div>

      <CartStoreTotals
        storeTotalWithoutTax={storeTotalWithoutTax}
        shippingFee={shippingFee}
        tax={tax}
        storeTotal={store.storeTotal}
      />
    </div>
  );
}

export default memo(CartStoreCard);
