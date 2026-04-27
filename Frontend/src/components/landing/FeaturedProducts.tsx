import React from 'react';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  imageColor: string;
}

export interface FeaturedProductsProps {
  addToCart: (product: Product) => void;
  toggleFavorite: (product: Product) => void;
  favoriteItems: Product[];
}


const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ addToCart, toggleFavorite, favoriteItems }) => {
  const products: Product[] = [
    {
      id: 1,
      name: 'متجر التقنية الحديثة',
      title: 'سماعات لاسلكية بخاصية إلغاء الضوضاء',
      price: '299.99 ج.م',
      rating: 4.8,
      reviews: 234,
      imageColor: '#FFD13B'
    },
    {
      id: 2,
      name: 'متجر التقنية الحديثة',
      title: 'ساعة ذكية برو',
      price: '399.99 ج.م',
      rating: 4.7,
      reviews: 189,
      imageColor: '#E2E2E2'
    },
    {
      id: 3,
      name: 'متجر التقنية الحديثة',
      title: 'لابتوب جيمنج احترافي',
      price: '1299.99 ج.م',
      rating: 4.9,
      reviews: 156,
      imageColor: '#3B3B3B'
    },
    {
      id: 4,
      name: 'متجر التقنية الحديثة',
      title: 'كاميرا رقمية 4K',
      price: '899.99 ج.م',
      rating: 4.8,
      reviews: 142,
      imageColor: '#F0F0F0'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 sm:gap-0">
          <div className="fp-title-area">
            <h2 className="text-3xl font-bold mb-2.5">المنتجات المميزة</h2>
            <p className="text-text-muted text-lg">أفضل المنتجات المختارة لك</p>
          </div>
          <button className="flex items-center gap-2 bg-transparent border border-primary text-primary px-5 py-2 rounded-full font-semibold text-sm transition-colors hover:bg-primary hover:text-white">
            عرض الكل <ChevronLeft size={16} />
          </button>
        </div>

        <div className="flex items-center gap-5 relative">
          <button className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#e0e0e0] items-center justify-center text-primary shadow-sm transition-all flex-shrink-0 z-10 hover:bg-primary hover:text-white">
            <ChevronRight size={24} />
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 flex-1">
            {products.map((product) => {
              const isFav = favoriteItems?.some(fav => fav.id === product.id);
              return (
              <div key={product.id} className="border border-[#e0e0e0] rounded-xl overflow-hidden bg-white transition-all hover:shadow-lg hover:-translate-y-1 group">
                <div className="h-[200px] relative flex flex-col justify-between p-4" style={{ backgroundColor: product.imageColor }}>
                  <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border-none flex items-center justify-center text-[#999] shadow-md transition-colors hover:text-[#ff4757]" onClick={() => toggleFavorite(product)}>
                    <Heart size={18} fill={isFav ? "#ef4444" : "none"} color={isFav ? "#ef4444" : "currentColor"} />
                  </button>
                  <div className="mt-auto self-start">
                    <span className="bg-white/90 px-2.5 py-1 rounded-full text-xs font-semibold text-text-dark">{product.name}</span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-base font-bold mb-4 leading-snug h-[2.8em] line-clamp-2">{product.title}</h3>
                  <div className="flex items-center gap-1.25 mb-4 text-sm">
                    <div className="stars">
                      <Star size={14} fill="#FFD13B" color="#FFD13B" />
                    </div>
                    <span className="font-bold text-text-dark">{product.rating}</span>
                    <span className="text-text-muted">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-4">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    <button className="inline-flex items-center gap-1.25 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors hover:bg-primary-dark" onClick={() => addToCart(product)}>
                      <ShoppingCart size={18} /> أضف
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>

          <button className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#e0e0e0] items-center justify-center text-primary shadow-sm transition-all flex-shrink-0 z-10 hover:bg-primary hover:text-white">
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
