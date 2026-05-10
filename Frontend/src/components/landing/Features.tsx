import React from 'react';
import { Store, Package, Star, ArrowLeft } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-accent-light hover:border-accent transition-all hover:shadow-lg text-center">
            <div data-slot="card-content" className="last:pb-6 p-8">
              <div className="w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-text-dark">توصيل سريع</h3>
              <p className="text-sm text-text-muted">شحن لجميع أنحاء مصر</p>
            </div>
          </div>
          
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-accent-light hover:border-accent transition-all hover:shadow-lg text-center">
            <div data-slot="card-content" className="last:pb-6 p-8">
              <div className="w-16 h-16 bg-linear-to-br from-accent to-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-text-dark">دفع آمن</h3>
              <p className="text-sm text-text-muted">حماية كاملة للمعاملات</p>
            </div>
          </div>
          
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-accent-light hover:border-accent transition-all hover:shadow-lg text-center">
            <div data-slot="card-content" className="last:pb-6 p-8">
              <div className="w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-text-dark">سهولة الإرجاع</h3>
              <p className="text-sm text-text-muted">إرجاع خلال 14 يوم</p>
            </div>
          </div>
          
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-accent-light hover:border-accent transition-all hover:shadow-lg text-center">
            <div data-slot="card-content" className="last:pb-6 p-8">
              <div className="w-16 h-16 bg-linear-to-br from-accent to-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-text-dark">دعم 24/7</h3>
              <p className="text-sm text-text-muted">فريقنا دائماً متاح</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

