import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className='container mx-auto px-4 w-full h-[250px] bg-primary' >
          <p>Hero</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
