import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroCarousel from '../components/HeroCarousel'
import ProductSection from '../components/ProductSection'
import CategoriesSection from '../components/CategoriesSection'
import ProductBanner from '../components/ProductBanner'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../lib/api'
import ProductSectionSkeleton from '../components/ProductSectionSkeleton'

const Home = () => {
  const [showBanner, setShowBanner] = useState(true)

  // Fetch all products
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProduct(), // pass nothing => fetch all
  })

  const products = data?.products || []

  const topSellers = products.filter((p) => p.rating >= 4.7)
  const blackFridayDeals = products.filter((p) => p.price < p.mrp)
  const recommended = [...products].sort(() => Math.random() - 0.5).slice(0, 5)
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div>
      
      <section className="container mx-auto px-4 py-8">
        <HeroCarousel />
      </section>

      <CategoriesSection />

      <div className="container mx-auto px-4">
        {isLoading ? (
          <>
            <ProductSectionSkeleton />
            <ProductSectionSkeleton />
            <ProductSectionSkeleton />
            <ProductSectionSkeleton />
            <ProductSectionSkeleton />
          </>
        ) : isError ? (
          <p className="p-6 text-center text-red-500">Failed to load products.</p>
        ) : (
          <>
            <ProductSection title="Black Friday Deals" products={blackFridayDeals} />
            <ProductSection title="Top Products" products={topSellers} />
            <ProductBanner />
            <ProductSection title="Recommended For You" products={recommended} />
            <ProductSection title="New Arrivals" products={newArrivals} />
          </>
        )}
      </div>

     
    </div>
  )
}

export default Home
