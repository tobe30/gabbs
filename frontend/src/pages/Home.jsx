import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroCarousel from '../components/HeroCarousel'
import ProductSection from '../components/ProductSection'
import { products } from '../assets/products'
import CategoriesSection from '../components/CategoriesSection'
import ProductBanner from '../components/ProductBanner'

const Home = () => {
   const topSellers = products.filter((p) => p.rating >= 4.7);
  const blackFridayDeals = products.filter((p) => p.price < 200);
  const recommended = products.slice(0, 5);
  const newArrivals = products.filter((p) => p.inStock).slice(0, 5);
  return (
    <div>
        <Navbar/>

        {/* Hero Carousel */}
      <section className="container mx-auto px-4 py-8">
        <HeroCarousel />
      </section>

      {/* Categories Section */}
      <CategoriesSection />


       {/* Product Sections */}
      <div className="container mx-auto px-4">
        <ProductSection title=" Black Friday Deals" products={blackFridayDeals} />
        <ProductSection title=" Top Products" products={topSellers} />
      <ProductBanner/>

        <ProductSection title=" Recommended For You" products={recommended} />
        <ProductSection title=" New Arrivals" products={newArrivals} />
      </div>
        <Footer/>
    </div>
  )
}

export default Home