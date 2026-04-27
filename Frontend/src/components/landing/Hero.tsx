import React from 'react';
import { ShoppingCart, Store, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="bg-[#00769A] text-white py-15 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 max-w-[600px]">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Zap size={16} />
            <span>منصة التجارة الإلكترونية الأولى في مصر</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-5 drop-shadow-md max-sm:text-3xl">اكتشف منتجات مميزة من بائعين موثوقين</h1>
          <p className="text-lg leading-relaxed mb-9 opacity-90">
            انضم إلى آلاف المشترين والبائعين في سوقنا. أنشئ متجرك الخاص، بع منتجاتك، وطوّر عملك بسهولة.
          </p>
          <div className="flex gap-4 max-sm:flex-col">
            <button className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-lg font-bold transition-all bg-white text-[#005B7F] hover:bg-[#f0f0f0] hover:-translate-y-0.5 hover:shadow-lg">
              <ShoppingCart size={20} />
              تسوق الآن
            </button>
            <button className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-lg font-bold transition-all bg-transparent text-white border-2 border-white hover:bg-white/10 hover:-translate-y-0.5">
              <Store size={20} />
              انضم كبائع
            </button>
          </div>
        </div>
        <div className="flex-1 relative flex justify-end w-full">
          <div className="relative w-full max-w-[550px] h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Using a placeholder gradient since we don't have the exact image */}
            <div className="w-full h-full bg-gradient-to-br from-[#1e3c72] to-[#2a5298]"></div>
            
            <div className="absolute bottom-5 left-5 bg-white/15 backdrop-blur-md p-5 rounded-xl border border-white/30 max-w-[300px]">
              <div className="flex items-center justify-between gap-2.5 text-xs font-bold bg-black/30 px-2.5 py-1 rounded-xl mb-2.5 w-fit">
                <Store size={16} />
                <span>منصة موثوقة</span>
              </div>
              <div className="text-lg font-bold mb-1.5">انضم لآلاف البائعين</div>
              <div className="text-sm opacity-90 leading-normal">ابدأ متجرك الإلكتروني اليوم واعرض منتجاتك لملايين المشترين</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
