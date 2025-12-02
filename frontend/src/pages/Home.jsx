import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroCarousel from '../components/HeroCarousel'
import ProductSection from '../components/ProductSection'
import { products } from '../assets/products'
import CategoriesSection from '../components/CategoriesSection'
import ProductBanner from '../components/ProductBanner'
import { X } from 'lucide-react'
import { useState } from 'react'

const Home = () => {
  const topSellers = products.filter((p) => p.rating >= 4.7);
  const blackFridayDeals =  products.filter((p) => p.rating >= 4.0);
  const recommended = products.slice(0, 5);
  const newArrivals = products.filter((p) => p.inStock).slice(0, 5);

  const [showBanner, setShowBanner] = useState(true);

  return (
    <div>

      {/* ✅ Only hide this section, not the whole page */}
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

              <span className="text-sm md:text-base font-semibold">
                on signup!
              </span>
            </div>
          </div>
        </section>
      )}

      <Navbar />

      <section className="container mx-auto px-4 py-8">
        <HeroCarousel />
      </section>

      <CategoriesSection />

      <div className="container mx-auto px-4">
        <ProductSection title="Black Friday Deals" products={blackFridayDeals} />
        <ProductSection title="Top Products" products={topSellers} />
        <ProductBanner />
        <ProductSection title="Recommended For You" products={recommended} />
        <ProductSection title="New Arrivals" products={newArrivals} />
      </div>

      <Footer />
    </div>
  )
}

export default Home
