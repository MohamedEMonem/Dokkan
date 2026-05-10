import React from 'react';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const SellerCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-linear-to-l from-primary to-primary-light text-white">
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
                className="px-12 text-xl rounded-xl hover:bg-accent-light"
                onClick={() => navigate('/auth/register')}
              >
                ابدأ البيع الآن
              </Button>
            </div>
            <div className="h-16">
              <Button
                variant="outline-white"
                className="px-12 text-xl rounded-xl transition-all duration-300 bg-white! text-primary! hover:bg-primary! hover:text-white!"
                onClick={() => navigate('/contact')}
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



