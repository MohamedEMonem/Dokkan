import React from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Store {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
}

const FeaturedStores: React.FC = () => {
  const stores: Store[] = [
    {
      id: 1,
      name: 'متجر التقنية الحديثة',
      rating: 4.8,
      reviews: 1250,
      description: 'متجرك الشامل لأحدث الأجهزة الإلكترونية والتقنية',
      image: 'https://images.unsplash.com/photo-1717295248494-937c3a5655b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MXx8fHwxNzYxOTEwNDA3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      name: 'الأزياء الراقية',
      rating: 4.6,
      reviews: 890,
      description: 'أزياء وإكسسوارات راقية للشخصية العصرية',
      image: 'https://images.unsplash.com/photo-1532435109783-fdb8a2be0baa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwZml0bmVzc3xlbnwxfHx8fDE3NjIwOTQxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      name: 'راحة المنزل',
      rating: 4.7,
      reviews: 650,
      description: 'أثاث جميل وديكورات منزلية عصرية',
      image: 'https://images.unsplash.com/photo-1628630468464-4168a51129f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzYyMDAyODkwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 4,
      name: 'عالم الإلكترونيات',
      rating: 4.7,
      reviews: 890,
      description: 'أحدث الأجهزة الإلكترونية والتقنية بأسعار منافسة',
      image: 'https://images.unsplash.com/photo-1749566679636-a9b0f4c52e08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMHN0b3JlJTIwdGVjaHxlbnwxfHx8fDE3NjM5Mjg5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <section className="py-16 bg-bg-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-text-dark mb-2">المتاجر المميزة</h2>
          <p className="text-lg text-text-muted">تسوق من أفضل البائعين</p>
        </div>

        <div className="relative md:px-16 px-0">
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 md:pb-0 snap-x snap-mandatory">
            {stores.slice(0, 3).map((store) => (
              <Card key={store.id} className="group hover:shadow-xl duration-300 cursor-pointer h-full flex flex-col min-w-72 md:min-w-0 snap-center shrink-0">
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 flex flex-col p-3 pt-8 items-center text-center">
                  <h3 className="text-text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1 text-sm font-bold">
                    {store.name}
                  </h3>

                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-text-dark text-xs font-bold">{store.rating}</span>
                    </div>
                    <span className="text-text-muted text-xs">({store.reviews})</span>
                  </div>

                  <p className="text-text-muted text-xs line-clamp-2 mb-3 flex-1 leading-relaxed">
                    {store.description}
                  </p>

                  <Button
                    variant="secondary"
                    className="h-8! text-xs font-bold w-full"
                  >
                    زيارة المتجر
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="secondary"
            className="hidden md:flex absolute size-12! rounded-full! top-1/2 -translate-y-1/2 right-0 shadow-lg p-0!"
            icon={<ArrowRight size={24} />}
          />
          <Button
            variant="secondary"
            className="hidden md:flex absolute size-12! rounded-full! top-1/2 -translate-y-1/2 left-0 shadow-lg p-0!"
            icon={<ArrowLeft size={24} />}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;


