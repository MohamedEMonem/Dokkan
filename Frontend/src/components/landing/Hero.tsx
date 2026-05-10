import React from 'react';
import { ShoppingCart, Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-l from-primary via-primary-light to-primary text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center justify-center rounded-md border font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden border-transparent bg-accent text-white mb-4 text-base px-4 py-2">
              ✨ منصة التجارة الإلكترونية الأولى في مصر
            </span>
            <h1 className="text-4xl md:text-5xl mb-6 leading-tight font-bold">
              اكتشف منتجات مميزة من بائعين موثوقين
            </h1>
            <p className="text-xl text-white/90 mb-8">
              انضم إلى آلاف المشترين والبائعين في سوقنا. أنشئ متجرك الخاص، بع منتجاتك، وطوّر عملك بسهولة.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="w-full sm:w-auto h-14">
                <Button 
                  variant="hero" 
                  icon={<ShoppingCart className="w-5 h-5 ml-2" />}
                  className="px-8 py-6 text-lg rounded-xl"
                  onClick={() => navigate('/products')}
                >
                  تسوّق الآن
                </Button>
              </div>
              <div className="w-full sm:w-auto h-14">
                <Button 
                  variant="outline-white" 
                  icon={<Store className="w-5 h-5 ml-2" />}
                  className="px-8 py-6 text-lg rounded-xl"
                  onClick={() => navigate('/auth/register')}
                >
                  انضم كبائع
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-110">
              <img 
                src="https://images.unsplash.com/photo-1758522484646-c8694d1784fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBvbmxpbmUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NjIxMTQ1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="سوق المحلات - منصة تجارة إلكترونية مصرية" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/70 via-primary/20 to-transparent flex flex-col justify-end p-6 text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden border-transparent bg-accent text-white border-none">
                    منصة موثوقة
                  </span>
                  <Store className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white text-xl mb-1 font-bold">انضم لآلاف البائعين</h3>
                <p className="text-white/90 text-sm">
                  ابدأ متجرك الإلكتروني اليوم واعرض منتجاتك لملايين المشترين
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


