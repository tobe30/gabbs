import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { products, categories } from "../assets/products";
import { Star } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Toaster, toast } from "react-hot-toast";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart, removeFromCart, cartItems } = useCart();

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Get quantity in cart
  const getQuantity = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Categories</h1>
        <p className="text-gray-500 mb-8">Browse products by category</p>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
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
              onClick={() => setSelectedCategory(category)}
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
            <span className="text-gray-500 text-lg">
              ({filteredProducts.length} items)
            </span>
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const quantity = getQuantity(product.id);

            const handleAdd = () => {
              addToCart(product);
              toast.success(`${product.name} added to cart`);
            };

            const handleSubtract = () => {
              if (quantity === 1) {
                removeFromCart(product.id);
              } else if (quantity > 1) {
                removeFromCart(product.id, true);
              }
            };

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                    {!product.inStock && (
                      <span className="text-xs text-red-500 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls / Add button */}
                  {quantity === 0 ? (
                    <button
                      onClick={handleAdd}
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
                        onClick={handleSubtract}
                        className="px-2 text-xl font-bold"
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={handleAdd}
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
      </div>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default Categories;
