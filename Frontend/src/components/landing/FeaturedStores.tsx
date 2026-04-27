import React from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  imageColor: string;
}

const FeaturedStores: React.FC = () => {
  const stores: Store[] = [
    {
      id: 1,
      name: 'راحة المنزل',
      description: 'أثاث جميل وديكورات منزلية عصرية',
      rating: 4.7,
      reviews: 650,
      imageColor: '#D2D8C6' // Sage green proxy for furniture
    },
    {
      id: 2,
      name: 'الأزياء الراقية',
      description: 'أزياء وإكسسوارات راقية للشخصية العصرية',
      rating: 4.6,
      reviews: 890,
      imageColor: '#B0594D' // Rust red proxy for fashion
    },
    {
      id: 3,
      name: 'متجر التقنية الحديثة',
      description: 'متجرك الشامل لأحدث الأجهزة الإلكترونية والتقنية',
      rating: 4.8,
      reviews: 1250,
      imageColor: '#30415D' // Dark blue proxy for tech room
    }
  ];

  return (
    <section className="py-20 bg-bg-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2.5">المتاجر المميزة</h2>
          <p className="text-text-muted text-lg">تسوق من أفضل البائعين</p>
        </div>

        <div className="flex items-center gap-5 relative">
          <button className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#e0e0e0] items-center justify-center text-primary shadow-sm transition-all flex-shrink-0 z-10 hover:bg-primary hover:text-white">
            <ArrowRight size={24} />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5 flex-1">
            {stores.map((store) => (
              <div key={store.id} className="bg-white border border-[#e0e0e0] rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary">
                <div className="h-[180px] w-full" style={{ backgroundColor: store.imageColor }}></div>
                
                <div className="p-6.25 text-center flex flex-col items-center">
                  <h3 className="text-lg font-bold mb-2.5 text-text-dark">{store.name}</h3>
                  <div className="flex items-center justify-center gap-1.25 mb-4 text-sm">
                    <span className="text-text-muted">({store.reviews})</span>
                    <span className="font-bold">{store.rating}</span>
                    <Star size={14} fill="#C08C5D" color="#C08C5D" />
                  </div>
                  <p className="text-text-muted text-[0.95rem] mb-6.25 leading-relaxed h-[2.85em] overflow-hidden">{store.description}</p>
                  
                  <button className="w-full p-3 bg-transparent border border-primary text-primary rounded-[25px] font-bold text-base transition-colors hover:bg-primary hover:text-white">
                    زيارة المتجر
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#e0e0e0] items-center justify-center text-primary shadow-sm transition-all flex-shrink-0 z-10 hover:bg-primary hover:text-white">
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;
