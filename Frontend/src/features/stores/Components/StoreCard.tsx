import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IStore } from "@/types/entities/store.types";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface IStoreProps {
  store: Partial<IStore>;
}

const StoreCard = ({ store }: IStoreProps) => {
  if (!store) return null;
  return (
    <>
      <Link
        className="h-full"
        to={`/@${store.subdomain}`} // Change to store details page when implemented
        data-discover="true"
      >
        <Card>
          <div
            data-slot="card-content"
            className="pb-6 p-0 flex flex-col h-full"
          >
            <div className="relative h-32 w-full overflow-hidden bg-bg-cream group">
              <img
                src={
                  store.logoUrl ||
                  "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                }
                alt={store.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>

            <div className="flex-1 flex flex-col p-3 pt-8">
              <h3 className="text-center text-text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1 text-sm">
                {store.name}
              </h3>
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <div className="flex items-center gap-0.5">
                  <Star size={12} fill="currentColor" className="text-accent" />
                  <span className="text-text-dark text-xs">4.8</span>
                </div>
                <span className="text-text-light text-xs">(1250)</span>
              </div>
              <p className="text-text-light text-xs text-center line-clamp-2 mb-3 flex-1 leading-relaxed">
                {store.description || "غير متوفر وصف للمتجر حالياً. "}
              </p>

              <Button className=" h-8!" variant="secondary">
                <span className="text-xs"> زيارة المتجر</span>
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </>
  );
};
export default StoreCard;
