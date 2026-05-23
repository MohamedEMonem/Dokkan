import React from "react";
import Hero from "@/components/landing/Hero.tsx";
import Features from "@/components/landing/Features.tsx";
import Categories from "@/components/landing/Categories.tsx";
import FeaturedProducts, {
  Product,
} from "@/components/landing/FeaturedProducts.tsx";
import { useAppDispatch } from "@/store/hooks";
import { useAddItemMutation } from "@/api/cart.api";
import { addItemToCart } from "@/features/cart/logic/cartService";
import { store } from "@/store/store";
import { showNotification } from "@/utils/showNotification";
import FeaturedStores from "@/components/landing/FeaturedStores.tsx";
import SellerCTA from "@/components/landing/SellerCTA.tsx";

const Landing: React.FC = () => {
  const dispatch = useAppDispatch();
  const [addItemApi] = useAddItemMutation();

  const addToCart = async (product: Product) => {
    const parsedPrice =
      parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;
    const item = {
      productId: String(product.id),
      quantity: 1,
      title: product.title,
      unitPrice: parsedPrice,
      imageUrl: product.image,
    };
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    try {
      await addItemToCart({
        item,
        isAuthenticated,
        dispatch,
        addToCartApi: isAuthenticated
          ? (it: { productId: string; quantity: number }) =>
              addItemApi(it).unwrap()
          : undefined,
        getState: () => store.getState(),
      });

      // Fire-and-forget backend sync if authenticated
      if (isAuthenticated)
        addItemApi({ productId: item.productId, quantity: item.quantity })
          .unwrap()
          .catch(() => {});

      showNotification({
        variant: "success",
        message: "تمت إضافة المنتج إلى السلة",
      });
    } catch (err) {
      console.error("Failed to add to cart", err);
      showNotification({ variant: "error", message: "فشل إضافة المنتج للسلة" });
    }
  };

  const toggleFavorite = (product: Product) => {
    console.log("Toggled favorite:", product);
  };

  const favoriteItems: Product[] = [];

  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts
        addToCart={addToCart}
        toggleFavorite={toggleFavorite}
        favoriteItems={favoriteItems}
      />
      <FeaturedStores />
      <SellerCTA />
    </div>
  );
};

export default Landing;
