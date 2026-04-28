import React from 'react';
import { Store, Package, Star, ArrowLeft } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-[#EBD8B7] hover:border-[#C49A6C] transition-all hover:shadow-lg text-center">
            <div data-slot="card-content" className="[&:last-child]:pb-6 p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#005B7F] to-[#007AA3] rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-[#2B2B2B]">توصيل سريع</h3>
              <p className="text-sm text-[#6B6B6B]">شحن لجميع أنحاء مصر</p>
            </div>
          </div>
          
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-[#EBD8B7] hover:border-[#C49A6C] transition-all hover:shadow-lg text-center">
            <div data-slot="card-content" className="[&:last-child]:pb-6 p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C49A6C] to-[#B08A5C] rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-[#2B2B2B]">دفع آمن</h3>
              <p className="text-sm text-[#6B6B6B]">حماية كاملة للمعاملات</p>
            </div>
          </div>
          
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-[#EBD8B7] hover:border-[#C49A6C] transition-all hover:shadow-lg text-center">
            <div data-slot="card-content" className="[&:last-child]:pb-6 p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#005B7F] to-[#007AA3] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-[#2B2B2B]">سهولة الإرجاع</h3>
              <p className="text-sm text-[#6B6B6B]">إرجاع خلال 14 يوم</p>
            </div>
          </div>
          
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-[#EBD8B7] hover:border-[#C49A6C] transition-all hover:shadow-lg text-center">
            <div data-slot="card-content" className="[&:last-child]:pb-6 p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C49A6C] to-[#B08A5C] rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-[#2B2B2B]">دعم 24/7</h3>
              <p className="text-sm text-[#6B6B6B]">فريقنا دائماً متاح</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

