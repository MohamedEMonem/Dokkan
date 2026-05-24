import React from "react";
import Hero from "@/components/landing/Hero.tsx";
import Features from "@/components/landing/Features.tsx";
import Categories from "@/components/landing/Categories.tsx";
import FeaturedProducts, {
  Product,
} from "@/components/landing/FeaturedProducts.tsx";

import { useAddItemMutation } from "@/api/cart.api";
import useCartService from "@/hooks/useCartService";
import { showNotification } from "@/utils/showNotification";
import FeaturedStores from "@/components/landing/FeaturedStores.tsx";
import SellerCTA from "@/components/landing/SellerCTA.tsx";
import { readSession } from "@/hooks/useCartSession";

const Landing: React.FC = () => {
  const [addItemApi] = useAddItemMutation();
  const { addItemToCart } = useCartService();

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

    const { isAuthenticated } = readSession();
    try {
      await addItemToCart({
        item,
        isAuthenticated,
        addToCartApi: isAuthenticated
          ? (it: { productId: string; quantity: number }) =>
              addItemApi(it).unwrap()
          : undefined,
      });

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
