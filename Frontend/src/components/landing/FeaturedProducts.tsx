import React from 'react';
import { ShoppingCart, Heart, Star, ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface Product {
  id: number;
  name: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
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
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYyMDc3MzU4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      name: 'متجر التقنية الحديثة',
      title: 'ساعة ذكية برو',
      price: '399.99 ج.م',
      rating: 4.7,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1532435109783-fdb8a2be0baa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwZml0bmVzc3xlbnwxfHx8fDE3NjIwOTQxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      name: 'متجر التقنية الحديثة',
      title: 'لابتوب جيمنج احترافي',
      price: '1299.99 ج.م',
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1640955014216-75201056c829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3B8ZW58MXx8fHwxNzYyMDk4NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 4,
      name: 'متجر التقنية الحديثة',
      title: 'كاميرا رقمية 4K',
      price: '899.99 ج.م',
      rating: 4.8,
      reviews: 142,
      image: 'https://images.unsplash.com/photo-1603208234872-619ffa1209cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwY2FtZXJhfGVufDF8fHx8MTc2MjA0MDM0MHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 5,
      name: 'متجر التقنية الحديثة',
      title: 'شاشة جيمنج 27 بوصة',
      price: '449.99 ج.م',
      rating: 4.9,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb25pdG9yfGVufDF8fHx8MTc2MjEyMjgxM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 6,
      name: 'متجر التقنية الحديثة',
      title: 'راوتر واي فاي 6',
      price: '189.99 ج.م',
      rating: 4.8,
      reviews: 165,
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWZpJTIwcm91dGVyfGVufDF8fHx8MTc2MjEyMjgxNHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 7,
      name: 'الأزياء الراقية',
      title: 'حقيبة يد جلدية مصممة',
      price: '179.99 ج.م',
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwaGFuZGJhZ3xlbnwxfHx8fDE3NjIxMjI4MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 8,
      name: 'الأزياء الراقية',
      title: 'نظارات شمسية فاخرة',
      price: '159.99 ج.م',
      rating: 4.7,
      reviews: 85,
      image: 'https://images.unsplash.com/photo-1663585703603-9be01a72a62a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjIwMDgxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl text-text-dark mb-2">المنتجات المميزة</h2>
            <p className="text-lg text-text-muted">أفضل المنتجات المختارة لك</p>
          </div>
          <div className="flex">
            <Button
              variant="secondary"
              className="h-9! px-4 text-sm"
              icon={<ChevronLeft className="w-5 h-5" />}
              iconPos='left'
            >
              عرض الكل
            </Button>
          </div>
        </div>

        <div className="relative px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => {
              const isFav = favoriteItems?.some(fav => fav.id === product.id);
              return (
                <div key={product.id} className="group border-2 border-accent-light hover:border-accent transition-all hover:shadow-xl duration-300 overflow-hidden h-full flex flex-col bg-white rounded-xl">
                  <div className="relative h-32 w-full overflow-hidden bg-bg-cream">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Button                       
                      variant="secondary"
                      className="absolute top-2 left-2 w-7! h-7! bg-white/90! hover:bg-white! rounded-full! shadow-md transition-colors p-0! border-0!"
                      onClick={() => toggleFavorite(product)}
                      aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                      aria-pressed={isFav}
                      icon={<Heart 
                        size={14} 
                        className={isFav ? "text-[#ff4757] fill-[#ff4757]" : "text-accent"} 
                        aria-hidden="true"
                      />}
                      iconPos='right'
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col p-3">
                    <p className="text-xs text-text-muted mb-1 line-clamp-1">{product.name}</p>
                    <h3 className="text-text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2 text-sm leading-tight min-h-10">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span className="text-text-dark text-xs">{product.rating}</span>
                      </div>
                      <span className="text-text-muted text-xs">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      <span className="text-primary text-sm">{product.price}</span>
                      <div className="flex">
                        <Button 
                          className="h-8! px-3 text-xs gap-1.5"
                          onClick={() => addToCart(product)}
                          icon={<ShoppingCart className="w-3.5 h-3.5" />}
                          iconPos='right'
                        >
                          أضف
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button 
            variant="secondary"
            className="absolute size-12! rounded-full! top-1/2 -translate-y-1/2 right-0 shadow-lg p-0!"
            icon={<ArrowRight size={24} />}
          />
          <Button 
            variant="secondary"
            className="absolute size-12! rounded-full! top-1/2 -translate-y-1/2 left-0 shadow-lg p-0!"
            icon={<ArrowLeft size={24} />}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;



