import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

const ProductBanner = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

        <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">

          {/* Left */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full border border-orange-500/30">
              <Zap className="h-4 w-4 fill-orange-400" />
              <span className="text-sm font-bold">LIMITED TIME OFFER</span>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                MacBook Pro
                <span className="block text-2xl md:text-3xl lg:text-4xl text-slate-300 mt-2">
                  M3 Chip
                </span>
              </h2>
              <p className="text-slate-300 text-lg md:text-xl mb-2">
                Supercharged performance
              </p>
              <p className="text-slate-400 text-sm md:text-base">
                Up to 22 hours of battery life. Stunning Liquid Retina XDR display.
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl md:text-6xl font-bold text-white">₦3,100,000</span>
              <div>
                <span className="text-xl text-slate-400 line-through">₦3,500,000</span>
                <span className="ml-2 inline-block bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Save ₦400,000
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">

              <Link to="/product/1">
                <button className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg px-8 py-3 rounded-lg shadow-lg group transition-all">
                  Shop Now
                  <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link to="/products?category=Electronics">
                <button className="border border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-3 rounded-lg transition-all">
                  View All Laptops
                </button>
              </Link>

            </div>
          </div>

          {/* Right image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
              alt="MacBook Pro"
              className="relative w-full h-auto rounded-2xl shadow-2xl hover-scale"
            />
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white rounded-2xl p-4 shadow-2xl animate-scale-in">
              <p className="text-xs font-semibold mb-1">Free Shipping</p>
              <p className="text-2xl font-bold">Today!</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductBanner;
