import { IProduct } from "@/types/entities/product.types";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { showNotification } from "@/utils/showNotification";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useAddItemMutation } from "@/api/cart.api";
import { addItemToCart } from "@/features/cart/logic/cartService";
import { store } from "@/store/store";
import { useCartSession } from "@/features/cart/hooks/useCartSession";

type ProductProps = {
  product: IProduct;
};

export const ProductCard = ({ product }: ProductProps) => {
  const dispatch = useAppDispatch();
  const [addItemApi] = useAddItemMutation();
  const { isAuthenticated } = useCartSession();
  const productId = product?.id ?? "";

  const [isFav, setIsFav] = useState(false); //Temporary state for favorite status, replace with actual logic later

  // Handlers

  const toggleFavorite1 = (product: IProduct) => {
    setIsFav(!isFav);
    showNotification({
      message: product.title,
      variant: "success",
    });
  };

  const AddToCartHandler = async (product: IProduct) => {
    const item = {
      productId: String(product.id),
      quantity: 1,
      title: product.title,
      unitPrice: product.price ?? 0,
      imageUrl: (product.images?.[0]?.imageUrl ?? null) as string | null,
      storeId: (product.store?.id ?? null) as string | null,
    };
    try {
      await addItemToCart({
        item,
        isAuthenticated: isAuthenticated,
        dispatch,
        addToCartApi: (item) => addItemApi(item).unwrap(),
        getState: () => store.getState(),
      });

      showNotification({
        message: "تمت إضافة المنتج إلى السلة",
        variant: "success",
      });
    } catch (err) {
      console.error("Add to cart failed", err);
      showNotification({ message: "فشل إضافة المنتج للسلة", variant: "error" });
    }
  };

  if (!product || !productId) return null;
  return (
    <Link className="h-full" to={`/products/${productId}`} data-discover="true">
      <Card>
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
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFav
                    ? "fill-red-500 stroke-red-500"
                    : "fill-none stroke-accent"
                }`}
              />
            </button>
          </div>

          <div className="flex-1 flex flex-col p-3">
            <p className="text-xs text-text-muted mb-1 line-clamp-1">
              {product.store?.name || "متجر دكان"}
            </p>
            <h3 className="text-text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2 text-sm leading-tight min-h-10">
              {product.title}
            </h3>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {<Star className="w-3 h-3 fill-accent text-accent" />}
                <span className="text-text-dark text-xs">4.8</span>
              </div>
              <span className="text-text-muted text-xs">(165)</span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-auto">
              <span className="text-primary text-sm">
                {product.price?.toLocaleString()} ج.م
              </span>

              <Button
                icon={<ShoppingCart className="w-4 h-4 ml-1 " />}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  AddToCartHandler(product);
                }}
                className="w-18! h-8!"
              >
                <span className="text-xs"> أضف</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
