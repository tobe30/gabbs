import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAddress, getUserAddresses } from "../lib/api";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axios";

const Checkout = () => {
  const { cartItems, applyCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [addressesState, setAddressesState] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
  name: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "Nigeria",
  phone: "",
});


  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getToken, isSignedIn } = useAuth();


  useEffect(() => {
  if (!isSignedIn) {
    toast.error("Something went wrong.");
    navigate("/"); // or "/login"
  }
}, [isSignedIn, navigate]);


  // Fetch user addresses
  const { data } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const token = await getToken();
      return getUserAddresses(token);
    },
  });

useEffect(() => {
  if (data?.length > 0) {
    setAddressesState(data);
  }
}, [data]);

// useEffect(() => {
//   console.log("Fetched addresses:", data);
// }, [data]);

  // Mutation for adding a new address
  const { mutate: createAddress, isLoading } = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      toast.success("Address added successfully");
      queryClient.invalidateQueries(["addresses"]);
      setShowAddressModal(false);
      setNewAddress({
      name: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Nigeria",
      phone: "",
    });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
      console.error("Add Address Error:", error);
    },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * (discount || 0); // <- safe fallback
const total = subtotal - discountAmount;


const handleApplyCoupon = async () => {
  const result = await applyCoupon(couponCode);
  console.log("Discount state:", couponCode);

  if (result.success) {
    setDiscount(result.discount);
    toast.success(result.message);
  } else {
    toast.error(result.message);
  }
};
const [isOrdering, setIsOrdering] = useState(false);

const { mutateAsync: placeOrder } = useMutation({
  mutationFn: async () => {
    if (!selectedAddressId) throw new Error("Please select a delivery address");

    const token = await getToken();

    // Map cartItems to the format the backend expects
    const orderItems = cartItems.map(item => ({
      id: item.productId || item._id, // make sure this is the actual product _id
      quantity: item.quantity
    }));
    console.log("Order items being sent to backend:", orderItems);

    // Safety check
    orderItems.forEach(item => {
      if (!item.id) {
        throw new Error(`Product ID is missing for one of the cart items`);
      }
    });

    console.log("Sending order items:", orderItems); // debug log

    const res = await axiosInstance.post(
      "/order/place-order",
      {
        items: orderItems,
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: couponCode || null,
        discount,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (paymentMethod === 'STRIPE') {
      const session = res.data.session;
      if (!session?.url) throw new Error("Stripe session not found");
      window.location.href = session.url; // redirect immediately
      
    }else { toast.success(res.data.message); navigate('/orders'); }

    return res.data;
  },
});


const handleCheckout = async (e) => {
  e.preventDefault();
  setIsOrdering(true); // start spinner
  try {
    const order = await placeOrder();
    if (paymentMethod === "COD") {
      toast.success("Order placed successfully! 🎉");
      clearCart(); // clear after successful order
      navigate(`/orders`);
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || err.message || "Failed to place order");
  }
};


  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* SHIPPING CARD */}
              <div className="bg-white rounded-xl border border-gray-300 p-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                {/* Address Dropdown */}
                <div className="mt-4">
                  <label className="font-medium">Delivery Address</label>
                  <div className="flex gap-2 mt-2">
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  disabled={addressesState.length === 0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100"
                  required
                >
                  <option value="" disabled>
                    {addressesState.length === 0
                      ? "No saved addresses"
                      : "Select delivery address"}
                  </option>

                  {addressesState.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.name} — {addr.street}, {addr.city}, {addr.state}, {addr.country}
                    </option>
                  ))}
                </select>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      ➕
                    </button>
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
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <div>
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay on delivery</div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setPaymentMethod("STRIPE")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "STRIPE"}
                      onChange={() => setPaymentMethod("STRIPE")}
                    />
                    <div>
                      <div className="font-semibold">Card Payment</div>
                      <div className="text-sm text-gray-500">
                        Pay securely online
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:brightness-90 flex items-center justify-center gap-2"
                  disabled={isOrdering}
                >
                  {isOrdering ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Placing Order...
                    </>
                  ) : (
                    `Place Order - ₦${total.toLocaleString()}`
                  )}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Address</h2>

            <div className="space-y-4">
              <input
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newAddress.email}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, email: e.target.value })
                }
              />

              <input
                placeholder="Street"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />

              <input
                placeholder="City"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />

              <input
                placeholder="State"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />

              <input
                placeholder="ZIP Code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newAddress.zip}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, zip: e.target.value })
                }
              />

              <input
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

             <button
              onClick={async () => {
                const token = await getToken();

                createAddress({
                  token,
                  address: newAddress,
                });
              }}
  disabled={isLoading}
  className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
>
  {isLoading ? "Saving..." : "Save Address"}
</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
