import React from 'react';
import { Smartphone, ShoppingBag, Home, Sparkles, Dumbbell, BookOpen } from 'lucide-react';

interface Category {
  id: number;
  icon: React.ElementType;
  title: string;
  count: string;
}

const Categories: React.FC = () => {
  const categories: Category[] = [
    { id: 1, icon: Smartphone, title: 'الإلكترونيات', count: '24 منتج' },
    { id: 2, icon: ShoppingBag, title: 'الموضة والأزياء', count: '28 منتج' },
    { id: 3, icon: Home, title: 'المنزل والمعيشة', count: '28 منتج' },
    { id: 4, icon: Sparkles, title: 'مستحضرات التجميل', count: '17 منتج' },
    { id: 5, icon: Dumbbell, title: 'الرياضة', count: '17 منتج' },
    { id: 6, icon: BookOpen, title: 'الكتب', count: '18 منتج' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#FAF8F5] to-[#EBD8B7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-[#2B2B2B] mb-4">تسوّق حسب التصنيف</h2>
          <p className="text-lg text-[#6B6B6B]">اكتشف آلاف المنتجات في تصنيفات متنوعة</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              data-slot="card"
              className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-[#EBD8B7] hover:border-[#C49A6C] hover:shadow-lg transition-all cursor-pointer group"
            >
              <div data-slot="card-content" className="[&:last-child]:pb-6 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#005B7F] to-[#007AA3] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-sm mb-1 text-[#2B2B2B] group-hover:text-[#005B7F] transition-colors">{category.title}</h3>
                <p className="text-xs text-[#6B6B6B]">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

