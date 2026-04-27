import React from 'react';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SellerCTA: React.FC = () => {
  return (
    <section className="bg-primary text-white py-20 text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-4xl font-extrabold mb-5">هل أنت بائع؟</h2>
          <p className="text-lg mb-10 leading-relaxed opacity-90">
            افتح متجرك الإلكتروني اليوم وابدأ البيع لملايين العملاء في مصر
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <div className="w-full sm:w-auto h-12">
              <Button 
                variant="hero" 
                icon={<Store size={20} />}
                className="px-6 py-3 text-lg font-bold"
              >
                ابدأ البيع الآن
              </Button>
            </div>
            <div className="w-full sm:w-auto h-12">
              <Button 
                variant="outline-white" 
                className="px-6 py-3 text-lg font-bold"
              >
                تواصل معنا
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerCTA;

