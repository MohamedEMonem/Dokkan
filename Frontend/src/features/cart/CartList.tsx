import { memo } from "react";
import { ICartStore } from "@/types/entities/cart.types";
import CartStoreCard from "./components/CartStoreCard";
import CartMultiStoreNotice from "./components/CartMultiStoreNotice";

const SHIPPING_FEE = 5;
const TAX_RATE = 0.14;

interface Props {
  stores: ICartStore[];
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

function CartList({ stores, onQtyChange, onRemove }: Props) {
  if (!stores || stores.length === 0) return <div>No items</div>;

  return (
    <div className="lg:col-span-2 space-y-6">
      {stores.map((store) => (
        <CartStoreCard
          key={store.storeId}
          store={store}
          shippingFee={SHIPPING_FEE}
          taxRate={TAX_RATE}
          onQtyChange={onQtyChange}
          onRemove={onRemove}
        />
      ))}

      {stores.length > 1 && <CartMultiStoreNotice />}
    </div>
  );
}

export default memo(CartList);
