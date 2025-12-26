import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "../contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../lib/api";
import ProductSectionSkeleton from "../components/ProductSectionSkeleton";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, decrementFromCart, cartItems } = useCart();

  // Fetch products from backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    keepPreviousData: true,
  });

  const products = data?.products || [];

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current quantity in cart
  const getQuantity = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

    const handleSubtract = (product) => {
    decrementFromCart(product);
  };
  // Show skeleton while loading or fetching
  const showSkeleton = isLoading

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-gray-600 mb-6">Browse our complete collection</p>

          {/* Search input */}
          <div className="relative max-w-xl mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {showSkeleton ? (
          <ProductSectionSkeleton />
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load products.</p>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const quantity = getQuantity(product._id);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.ratingStats?.average || 0)
                              ? "text-red-400 fill-red-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium">
                        {product.ratingStats?.average?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({product.ratingStats?.count || 0})
                      </span>
                    </div>


                    <div className="flex items-center justify-between mb-3">
                      <p className="text-2xl font-bold text-primary">
                        ₦{product.price.toLocaleString()}
                      </p>
                      {!product.inStock && (
                        <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                      )}
                    </div>

                    {/* Add to Cart / Quantity controls */}
                    {quantity === 0 ? (
                      <button
                        onClick={() => handleAdd(product)}
                        disabled={!product.inStock}
                        className={`w-full px-4 py-2 rounded-lg text-white font-medium transition ${
                          product.inStock
                            ? "bg-primary hover:brightness-90"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between w-full border rounded-lg px-2 py-1">
                        <button
                          onClick={() => handleSubtract(product)}
                          className="px-2 text-xl font-bold"
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => handleAdd(product)}
                          className="px-2 text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Products;
