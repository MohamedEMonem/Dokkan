import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";
import StoreThemeProvider from "@/components/layout/StoreThemeProvider";

export default function HomeLayout() {
  return (
    <StoreThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </StoreThemeProvider>
  );
}

