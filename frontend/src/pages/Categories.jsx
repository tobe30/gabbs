import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import {toast} from "react-hot-toast";
import { getProduct } from "../lib/api";

// Simple Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-full" />
    </div>
  </div>
);

const Categories = () => {
  const { addToCart, decrementFromCart, cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Get category from query string
  const params = new URLSearchParams(location.search);
  const categoryQuery = params.get("category") || null;

  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);

  useEffect(() => {
    setSelectedCategory(categoryQuery);
  }, [categoryQuery]);

  // Fetch products by category
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => getProduct(selectedCategory),
    keepPreviousData: true,
  });

  const products = data?.products || [];

  // Unique categories from fetched products
  const categories = [...new Set(data?.products?.map((p) => p.category))];

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(category ? `/categories?category=${encodeURIComponent(category)}` : "/categories");
  };

  return (
    <div className="min-h-screen bg-background">
      

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Categories</h1>
        <p className="text-gray-500 mb-8">Browse products by category</p>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedCategory === null
                ? "bg-primary text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            {selectedCategory || "All Products"}{" "}
            <span className="text-gray-500 text-lg">({products.length} items)</span>
          </h2>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load products.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const quantity = getQuantity(product._id);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="aspect-square overflow-hidden">
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
                      <p className="text-2xl font-bold text-primary">${product.price}</p>
                      {!product.inStock && (
                        <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                      )}
                    </div>

                    {quantity === 0 ? (
                      <button
                        onClick={() => handleAdd(product)}
                        disabled={!product.inStock}
                        className={`w-full px-4 py-2 rounded-lg text-white font-medium transition ${
                          product.inStock ? "bg-primary hover:brightness-90" : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between w-full border rounded-lg px-2 py-1">
                        <button onClick={() => handleSubtract(product._id, quantity)} className="px-2 text-xl font-bold">
                          -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => handleAdd(product)} className="px-2 text-xl font-bold">
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

export default Categories;
