import { memo } from "react";
import { Store } from "lucide-react";
import { Link } from "react-router-dom";

type CartStoreHeaderProps = {
  storeName: string;
  itemCount: number;
  subdomain: string;
};

function CartStoreHeader({
  storeName,
  itemCount,
  subdomain,
}: CartStoreHeaderProps) {
  return (
    <div className="bg-linear-to-l from-primary/5 to-white px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>

          <div>
            <Link to={`/@${subdomain}`}>
              <h3 className="text-lg text-text-dark">{storeName}</h3>
            </Link>

            <p className="text-sm text-gray-600">{itemCount} منتج</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CartStoreHeader);
