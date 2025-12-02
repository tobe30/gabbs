import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../contexts/CartContext";
import { Toaster, toast } from "react-hot-toast";

const Checkout = () => {
  const { cartItems, applyCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    if (result.success) {
      setDiscount(result.discount);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    clearCart();
    toast.success("Order Placed! Thank you for your purchase.");
    navigate("/");
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">

              {/* SHIPPING CARD */}
              <div className="bg-white rounded-xl border border-gray-300 p-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">First Name</label>
                    <input
                      required
                      className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="font-medium">Last Name</label>
                    <input
                      required
                      className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="font-medium">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div className="mt-4">
                  <label className="font-medium">Address</label>
                  <input
                    required
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="font-medium">City</label>
                    <input
                      required
                      className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="font-medium">State</label>
                    <input
                      required
                      className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="font-medium">ZIP Code</label>
                    <input
                      required
                      className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT CARD */}
              <div className="bg-white rounded-xl border border-gray-300 p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

                <label className="font-medium">Payment Method</label>
                <div className="mt-3 space-y-3">
                  <div
                    className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div>
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">
                        Pay on delivery
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setPaymentMethod("stripe")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                    />
                    <div>
                      <div className="font-semibold">Card Payment</div>
                      <div className="text-sm text-gray-500">
                        Pay securely online
                      </div>
                    </div>
                  </div>
                </div>

                {paymentMethod === "stripe" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="font-medium">Card Number</label>
                      <input
                        placeholder="1234 5678 9012 3456"
                        required
                        className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="font-medium">Expiry</label>
                        <input
                          placeholder="MM/YY"
                          required
                          className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                        />
                      </div>

                      <div>
                        <label className="font-medium">CVV</label>
                        <input
                          placeholder="123"
                          required
                          className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:brightness-90"
              >
                Place Order - ₦{total.toLocaleString()}
              </button>
            </form>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <div className="bg-white rounded-xl border border-gray-300 p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {item.name} ×{item.quantity}
                    </span>
                    <span className="font-medium">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <label className="font-medium">Coupon</label>

                <div className="flex gap-2 mt-2">
                  <input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-gray-300"
                  />

                  <button
                    onClick={handleApplyCoupon}
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Apply
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Try: WELCOME10, SAVE20, MEGA30
                </p>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount * 100}%)</span>
                    <span>- ₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
