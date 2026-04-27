import React from 'react';
import { Smartphone, ShoppingBag, Home, Sparkles, Dumbbell, BookOpen } from 'lucide-react';

interface Category {
  id: number;
  icon: React.ReactNode;
  title: string;
  count: string;
}

const Categories: React.FC = () => {
  const categories: Category[] = [
    { id: 1, icon: <Smartphone size={28} />, title: 'الإلكترونيات', count: '24 منتج' },
    { id: 2, icon: <ShoppingBag size={28} />, title: 'الموضة والأزياء', count: '28 منتج' },
    { id: 3, icon: <Home size={28} />, title: 'المنزل والمعيشة', count: '20 منتج' },
    { id: 4, icon: <Sparkles size={28} />, title: 'مستحضرات التجميل', count: '17 منتج' },
    { id: 5, icon: <Dumbbell size={28} />, title: 'الرياضة', count: '17 منتج' },
    { id: 6, icon: <BookOpen size={28} />, title: 'الكتب', count: '18 منتج' },
  ];

  return (
    <section className="py-20 bg-bg-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2.5">تسوق حسب التصنيف</h2>
          <p className="text-text-muted text-lg">اكتشف آلاف المنتجات في تصنيفات متنوعة</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-[#eaeaea] rounded-xl p-7.5 flex flex-col items-center justify-center text-center transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-primary group">
              <div className="w-17.5 h-17.5 rounded-full bg-primary text-white flex items-center justify-center mb-4 transition-all group-hover:scale-110">{cat.icon}</div>
              <h3 className="text-lg font-bold mb-1.5">{cat.title}</h3>
              <span className="text-sm text-text-muted">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
