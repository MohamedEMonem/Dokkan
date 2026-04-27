import React from 'react';
import { Truck, ShieldCheck, RefreshCcw, HeadphonesIcon } from 'lucide-react';

interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      id: 1,
      icon: <Truck size={32} />,
      title: 'توصيل سريع',
      description: 'شحن لجميع أنحاء مصر',
      bgColor: 'bg-primary'
    },
    {
      id: 2,
      icon: <ShieldCheck size={32} />,
      title: 'دفع آمن',
      description: 'حماية كاملة للمعاملات',
      bgColor: 'bg-accent'
    },
    {
      id: 3,
      icon: <RefreshCcw size={32} />,
      title: 'سهولة الإرجاع',
      description: 'إرجاع خلال 14 يوم',
      bgColor: 'bg-primary'
    },
    {
      id: 4,
      icon: <HeadphonesIcon size={32} />,
      title: 'دعم 24/7',
      description: 'فريقنا دائماً متاح',
      bgColor: 'bg-accent'
    },
  ];


  return (
    <section className="py-15 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div key={feature.id} className="border border-[#e0e0e0] rounded-xl p-7.5 text-center transition-all bg-white hover:-translate-y-1 hover:shadow-lg hover:border-primary">
              <div className={`w-15 h-15 rounded-full text-white flex items-center justify-center mx-auto mb-4 ${feature.bgColor}`}>{feature.icon}</div>
              <h3 className="text-lg font-bold mb-1.5">{feature.title}</h3>
              <p className="text-sm text-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
