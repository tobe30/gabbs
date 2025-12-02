import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { products } from "../assets/products";
import { Toaster, toast } from "react-hot-toast";
import { useCart } from "../contexts/CartContext";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, removeFromCart, cartItems } = useCart();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current quantity in cart
  const getQuantity = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const quantity = getQuantity(product.id);

            const handleAdd = () => {
              addToCart(product);
              toast.success(`${product.name} added to cart`);
            };

            const handleSubtract = () => {
              if (quantity === 1) {
                removeFromCart(product.id); // remove completely, goes back to Add to Cart
              } else if (quantity > 1) {
                removeFromCart(product.id, true); // decrement quantity
              }
            };

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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

                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({product.category})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-primary">₦{product.price.toLocaleString()}</p>
                    {!product.inStock && (
                      <span className="text-xs text-red-500 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Add to Cart / Quantity controls */}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default Products;
