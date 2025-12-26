import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, ShoppingCart, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import toast from "react-hot-toast";

// Mock reviews data

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, decrementFromCart, cartItems } = useCart();

  const { data: product, isLoading, error} = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data.product; 
  },
  })  

  const { data: ratingData, isLoading: ratingLoading } = useQuery({
  queryKey: ["product-ratings", id],
  queryFn: async () => {
    const res = await axiosInstance.get(`/ratings/product-rating/${id}`);
    return res.data;
  },
  enabled: !!id,
});

console.log(ratingData)


if (isLoading) {
  return (
    <div className="min-h-screen bg-background">
     
      <ProductDetailSkeleton />
     
    </div>
  );
}

if (error || product?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <p className="text-red-500 text-lg">
            {product?.error || "Error loading booking"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }




  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <button className="px-4 py-2 rounded-lg bg-primary text-white hover:brightness-90">
              Back to Products
            </button>
          </Link>
        </div>
      
      </div>
    );
  }

  const quantity = cartItems.find((i) => i.productId === product._id)?.quantity || 0;


  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

const handleSubtract = () => {
  decrementFromCart(product);
};


  return (
    <div className="min-h-screen bg-background">
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
              src={product.images}
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
      className={`h-5 w-5 ${
        i < Math.round(ratingData?.average || 0)
          ? "fill-red-500 text-red-500"
          : "text-gray-300"
      }`}
    />
  ))}
</div>

  <span className="font-medium">
  {ratingData?.average?.toFixed(1) || "0.0"}
</span>
<span className="text-gray-400">
  ({ratingData?.count || 0} reviews)
</span>

</div>

              <span className="text-gray-400">by Gabbs</span>
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

  {ratingData?.ratings?.length > 0 ? (
    <div className="space-y-6">
      {ratingData.ratings.map((review) => (
        <div
          key={review._id}
          className="bg-gray-100 rounded-lg p-6 text-gray-700"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-700" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold mb-1">
                    {review.userName || "Anonymous"}
                  </h4>

                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <time className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </time>
              </div>

              <p>{review.review}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No reviews yet</p>
  )}
</div>


      </div>


    </div>
  );
};

export default ProductDetail;
