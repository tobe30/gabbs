import { Link } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";

const ProductSection = ({ title, products, viewAllLink = "/products" }) => {
  return (
    <section className="py-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h2>
        <Link
          to={viewAllLink}
          className="text-red-500 hover:text-accent/80 flex items-center gap-1 font-medium transition-colors"
        >
          View All
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product, index) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Link to={`/product/${product.id}`}>
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="p-3">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center gap-1 mb-2">
                <Star className="h-3 w-3 fill-red-500 text-red-500" />
                <span className="text-xs font-medium">{product.rating}</span>
              </div>

              <div>
                <p className="text-xl font-bold text-primary">₦{product.price.toLocaleString()}</p>
                {!product.inStock && (
                  <span className="text-xs text-destructive font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
