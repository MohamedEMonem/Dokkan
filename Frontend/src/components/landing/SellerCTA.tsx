import React from 'react';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SellerCTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-l from-[#005B7F] to-[#007AA3] text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl mb-6">هل أنت بائع؟</h2>
          <p className="text-xl mb-8 text-white/90">
            افتح متجرك الإلكتروني اليوم وابدأ البيع لملايين العملاء في مصر
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="h-16">
              <Button
                variant="hero"
                icon={<Store className="w-6 h-6 ml-2" />}
                className="px-12 text-xl rounded-xl hover:bg-[#EBD8B7] !w-auto"
              >
                ابدأ البيع الآن
              </Button>
            </div>
            <div className="h-16">
              <Button
                variant="outline-white"
                className="px-12 text-xl rounded-xl transition-all duration-300 !w-auto !bg-white !text-[#005B7F] hover:!bg-[#005B7F] hover:!text-white"
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



