// components/Layout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { X } from "lucide-react";

const Layout = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div>
      {showBanner && (
        <section className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white py-2.5 shadow-md animate-fade-in relative">
          <div className="container mx-auto px-4">
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-3 top-2 text-white/80 hover:text-white transition"
            >
              <X size={20} />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-2 text-center px-6">
              <span className="text-sm md:text-base font-semibold tracking-wide">
                🎉 New Customer Offer: Get
                <span className="font-bold text-lg mx-1 px-2 py-0.5 bg-white/20 rounded">
                  5% OFF
                </span>
                with code
              </span>
              <span className="font-bold text-base md:text-lg bg-white text-orange-600 px-3 py-1 rounded-md shadow-sm">
                WELCOME5
              </span>
              <span className="text-sm md:text-base font-semibold">on signup!</span>
            </div>
          </div>
        </section>
      )}
      <Navbar />
      <Outlet />   {/* 👈 pages render here */}
      <Footer />
    </div>
  );
};

export default Layout;
