import { IProduct } from "@/types/entities/product.types";
import { Card } from "@/components/ui/Card";
import { Notification } from "@/components/ui/Notification";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

type ProductProps = {
  product: IProduct;
};

export const ProductCard = ({ product }: ProductProps) => {
  //   const dispatch = useAppDispatch();

  const productId = product?.id ?? "";

  const [isFav, setIsFav] = useState(false); //Temporary state for favorite status, replace with actual logic later

  // Handlers

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleFavorite1 = (product: IProduct) => {
    setIsFav(!isFav);
   <Notification />;
  };

  const AddToCartHandler = (product: IProduct) => {
    console.log(product);
  };

  if (!product || !productId) return null;
  return (
    <Link className="h-full" to={`/product/${productId}`} data-discover="true">
      <Card
        data-slot="card"
        className="text-card-foreground h-full gap-4 border-2 border-accent-light hover:border-accent hover:shadow-xl transition-all duration-300 group overflow-hidden  flex flex-col bg-white rounded-xl"
      >
        <div data-slot="card-content" className="pb-6 p-0 flex flex-col h-full">
          <div className="relative h-32 w-full overflow-hidden bg-bg-cream group">
            <img
              src={
                product.images?.[0]?.imageUrl ||
                "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
              }
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            {/* Favorite button */}
            <button
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite1(product);
              }}
              className="absolute top-2 left-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-heart w-3.5 h-3.5 ${
                  isFav
                    ? "fill-red-500 stroke-red-500"
                    : "fill-none stroke-accent"
                }`}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col p-3">
            <p className="text-xs text-[#6B6B6B] mb-1 line-clamp-1">
              {/* {product.store?.name} */}
              متجر دكان
            </p>
            <h3 className="text-[#2B2B2B] mb-2 group-hover:text-primary transition-colors line-clamp-2 text-sm leading-tight min-h-10">
              {product.title}
            </h3>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {<StartIcon />}
                <span className="text-[#2B2B2B] text-xs">4.8</span>
              </div>
              <span className="text-[#6B6B6B] text-xs">(165)</span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-auto">
              <span className="text-primary text-sm">
                {product.price?.toLocaleString()} ج.م
              </span>

              <Button
                icon={<CartIcon />}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  AddToCartHandler(product);
                }}
                style={{
                  padding: "0 10px",
                  borderRadius: "12px",
                  width: "72px",
                  height: "32px",
                }}
              >
                <span className="text-[12px]"> أضف</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const StartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-star w-3 h-3 fill-accent text-accent"
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
  </svg>
);

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-shopping-cart w-4 h-4 ml-1 "
  >
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);
