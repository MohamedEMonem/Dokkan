import React from 'react';
import { Store } from 'lucide-react';

const SellerCTA: React.FC = () => {
  return (
    <section className="bg-[#00769A] text-white py-20 text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-4xl font-extrabold mb-5">هل أنت بائع؟</h2>
          <p className="text-lg mb-10 leading-relaxed opacity-90">
            افتح متجرك الإلكتروني اليوم وابدأ البيع لملايين العملاء في مصر
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-lg font-bold transition-all bg-white text-[#00769A] hover:bg-[#f5f5f5] hover:-translate-y-0.5 hover:shadow-lg">
              <Store size={20} />
              ابدأ البيع الآن
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-lg font-bold transition-all bg-transparent text-white border-2 border-white hover:bg-white/10 hover:-translate-y-0.5">
              تواصل معنا
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerCTA;
