import React from 'react';
import Hero from '@/components/landing/Hero.tsx';
import Features from '@/components/landing/Features.tsx';
import Categories from '@/components/landing/Categories.tsx';
import FeaturedProducts, { Product } from '@/components/landing/FeaturedProducts.tsx';
import FeaturedStores from '@/components/landing/FeaturedStores.tsx';
import SellerCTA from '@/components/landing/SellerCTA.tsx';

const Landing: React.FC = () => {
  // Dummy handlers for FeaturedProducts
  const addToCart = (product: Product) => {
    console.log('Added to cart:', product);
  };

  const toggleFavorite = (product: Product) => {
    console.log('Toggled favorite:', product);
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

