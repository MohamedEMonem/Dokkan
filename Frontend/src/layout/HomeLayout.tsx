import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* <div className="container mx-auto px-4">
          <p>Hero</p>
        </div> */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
