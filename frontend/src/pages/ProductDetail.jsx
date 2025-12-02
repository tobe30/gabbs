import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { products } from "../assets/products";
import { Star, ArrowLeft, ShoppingCart, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Toaster, toast } from "react-hot-toast";

// Mock reviews data
const mockReviews = [
  { id: 1, author: "Sarah Johnson", date: "2024-11-15", rating: 5, comment: "Excellent product! Exceeded my expectations in every way." },
  { id: 2, author: "Michael Chen", date: "2024-11-10", rating: 5, comment: "Great quality and fast shipping. Very satisfied with my purchase." },
  { id: 3, author: "Emily Rodriguez", date: "2024-11-05", rating: 4, comment: "Good value for money. Would recommend to others." },
  { id: 4, author: "David Thompson", date: "2024-10-28", rating: 4, comment: "Solid product, does exactly what it promises." }
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, cartItems } = useCart();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <button className="px-4 py-2 rounded-lg bg-primary text-white hover:brightness-90">
              Back to Products
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const quantity = cartItems.find((i) => i.id === product.id)?.quantity || 0;

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/products"
          className="inline-flex items-center text-gray-500 gap-2 hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image with grey border */}
          <div className="rounded-xl overflow-hidden border border-gray-300">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          <div>
            <div className="mb-4">
              <span className="text-sm text-red-500 font-medium">{product.category}</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-red-500 text-red-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-400">by {product.company}</span>
            </div>

            <div className="mb-6">
              <p className="text-5xl font-bold text-primary mb-2">₦{product.price.toLocaleString()}</p>
              {product.inStock ? (
                <p className="text-green-600 font-medium">In Stock</p>
              ) : (
                <p className="text-destructive font-medium">Out of Stock</p>
              )}
            </div>

            <p className="text-gray-500 text-lg mb-8 leading-relaxed">{product.description}</p>

            {/* Custom Quantity Controls */}
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`w-full px-4 py-3 rounded-lg font-medium text-white transition ${
                  product.inStock
                    ? "bg-primary hover:brightness-90"
                    : "bg-gray-400 cursor-not-allowed"
                } flex items-center justify-center gap-2`}
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </button>
            ) : (
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                <div className="flex-1 flex items-center justify-between border rounded-lg px-2 py-1">
                  <button
                    onClick={handleSubtract}
                    className="px-6 py-3 bg-gray-200 rounded-lg text-xl font-bold flex-1"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold px-4">{quantity}</span>
                  <button
                    onClick={handleAdd}
                    className="px-6 py-3 bg-primary text-white rounded-lg text-xl font-bold flex-1"
                  >
                    +
                  </button>
                </div>
                <Link className="flex-1" to="/cart">
                  <button className="w-full h-full px-6 py-3 bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800">
                    <ShoppingCart className="h-5 w-5" /> View Cart
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section with grey card and grey text */}
        {/* Reviews Section with grey card and grey text */}
<div className="mt-16">
  <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
  <div className="space-y-6">
    {mockReviews.map((review) => (
      <div key={review.id} className="bg-gray-100 rounded-lg p-6 text-gray-700">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-700" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold mb-1">{review.author}</h4>
                <div className="flex items-center gap-1 pointer-events-none">
  {[...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < review.rating ? "text-red-500" : "text-gray-400"}`}
      fill={i < review.rating ? "currentColor" : "none"} // filled for rated stars, empty for others
      stroke={i < review.rating ? "none" : "currentColor"} // no border for filled stars
    />
  ))}
</div>

              </div>
              <time className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <p>{review.comment}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default ProductDetail;
