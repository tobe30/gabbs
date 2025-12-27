import React, { useState } from "react";
import { Package, MapPin, Calendar, DollarSign, Eye, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getUserOrders } from "../lib/api";
import { axiosInstance } from "../lib/axios";

const Orders = () => {
  // mock orders in state so we can update / interact
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [ratingProduct, setRatingProduct] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  // const [ratedProducts, setRatedProducts] = useState({});


  const { getToken } = useAuth();

 // get orders 
const { data, isLoading, isError  } = useQuery({
     queryKey: ["order"],
     queryFn: async () => {
       const token = await getToken();
       return getUserOrders(token);
     },
   });

  const orders = data?.orders || [];
  // console.log("eme", orders)


  const queryClient = useQueryClient();
// add rating
const rateProductMutation = useMutation({
  mutationFn: async ({ orderId, productId, rating, review }) => {
    const token = await getToken();

    const { data } = await axiosInstance.post(
      "/ratings/add-rating",
      {
        orderId,
        productId,
        rating,
        review,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },
onSuccess: () => {
  toast.success("Rating submitted 🎉");
  setIsRatingOpen(false);
  setRatingValue(0);
  setReviewText("");

  queryClient.invalidateQueries({ queryKey: ["ratings"] });
},


  onError: (error) => {
    toast.error(
      error?.response?.data?.error || "Failed to submit rating"
    );
  },
});


const handleSubmitRating = () => {
  rateProductMutation.mutate({
    orderId: ratingProduct.orderId,
    productId: ratingProduct.productId,
    rating: ratingValue,
    review: reviewText || "No review provided",
  });
};

  const getStatusClasses = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-800 border-green-100";
      case "shipped":
        return "bg-blue-50 text-blue-800 border-blue-100";
      case "pending":
        return "bg-orange-50 text-orange-800 border-orange-100";
      case "cancelled":
        return "bg-red-50 text-red-800 border-red-100";
      default:
        return "bg-gray-50 text-gray-800 border-gray-100";
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setIsDialogOpen(false);
  };


  const { data: ratingsData } = useQuery({
  queryKey: ["ratings"],
  queryFn: async () => {
    const token = await getToken();
    const res = await axiosInstance.get("/ratings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
});
const ratedMap = {};

ratingsData?.ratings?.forEach((r) => {
  ratedMap[`${r.orderId}_${r.productId}`] = r.rating;
});


  // const handleChangeStatus = (orderId, newStatus) => {
  //   setOrders((prev) =>
  //     prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
  //   );
  //   toast.success(`Order ${orderId} status updated to "${newStatus}"`);
  // };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {isLoading ? (
  <div className="rounded-lg bg-white shadow p-8 text-center">
    <span className="loading loading-spinner loading-lg"></span>
    <p className="mt-4 text-gray-500">Loading your orders…</p>
  </div>

        ): orders.length === 0 ? (
          <div className="rounded-lg bg-white shadow p-8 text-center">
            <Package className="mx-auto text-gray-400" size={48} />
            <h3 className="text-xl font-semibold mt-4">No orders yet</h3>
            <p className="text-gray-500 mt-2">Start shopping to see your orders here.</p>
            <div className="mt-6">
              <a
                href="/products"
                className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:opacity-95"
              >
                Browse Products
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="px-6 py-4 md:flex md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-gray-100 w-14 h-14 flex items-center justify-center">
                        <Calendar className="text-gray-500" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                        <span className="text-sm text-gray-500">
                          • {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-gray-400" />
                          <span className="truncate max-w-xs">{order.addressId.street}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="text-gray-400" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusClasses(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>

                    <div className="text-2xl font-bold text-gray-900">₦{order.total.toLocaleString()}</div>

                    <div className="flex items-center gap-2">


                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-gray-200 hover:shadow-sm"
                        title="View details"
                      >
                        <Eye size={16} className="text-primary" />
                        <span className="text-sm">View</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* items preview */}
                <div className="px-6 pb-4">
                  <div className="flex gap-4 overflow-x-auto py-2">
                    {order.orderItems.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 min-w-[220px]">
                        <img src={item.productId.images?.[0] || "/placeholder.png"} alt={item.productId.name} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{item.productId.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                       {(order.status === "COMPLETED" || order.status === "SHIPPED") && (
                      ratedMap[`${order._id}_${item.productId._id}`] ? (
                        <div className="mt-2 flex text-yellow-400 text-xl">
                          {Array.from({
                            length: ratedMap[`${order._id}_${item.productId._id}`],
                          }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setRatingProduct({
                              productId: item.productId._id,
                              orderId: order._id,
                              name: item.productId.name,
                            });
                            setIsRatingOpen(true);
                          }}
                          className="mt-2 text-sm text-primary font-semibold hover:underline"
                        >
                          ⭐ Rate product
                        </button>
                      )
                    )}


                      </div>
                    ))}

                    {order.orderItems.length > 4 && (
                          <div className="flex items-center text-sm text-gray-500">
                            +{order.orderItems.length - 4} more item(s)
                          </div>
                        )}

                  </div>
                </div>
                
              </div>
            ))}
          </div>
          
        )}
      </main>

      {/* Centered popup modal */}
      {isDialogOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseDialog}
            aria-hidden
          />

          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold">Order Details — #{selectedOrder._id}</h3>
                <p className="text-sm text-gray-500">
                  Placed {new Date(selectedOrder.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium border border-gray-300 ${getStatusClasses(selectedOrder.status)}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </div>

                <button
                  onClick={handleCloseDialog}
                  className="p-2 rounded hover:bg-gray-100"
                  aria-label="Close dialog"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3">Items</h4>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img src={item.productId.images?.[0] || "/placeholder.png"} alt={item.productId.name} className="w-20 h-20 object-cover rounded-md border border-gray-300" />
                      <div className="flex-1">
                        <p className="font-medium">{item.productId.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold mt-1">₦{(item.productId.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₦{(item.productId.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p className="text-gray-700">{selectedOrder.addressId.street}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold mb-2">Payment Method</h4>
                <p className="text-gray-700">{selectedOrder.paymentMethod}</p>
              </div>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold text-gray-900">₦{selectedOrder.total.toLocaleString()}</div>
              </div>

              
            </div>
          </div>
        </div>
      )}

      {isRatingOpen && ratingProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setIsRatingOpen(false)}
    />

    <div className="relative bg-white w-full max-w-md rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Rate {ratingProduct.name}
      </h3>

      {/* Stars */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRatingValue(star)}
            className={`text-2xl ${
              star <= ratingValue ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Review */}
      <textarea
        className="w-full border rounded-lg p-3 text-sm"
        rows="4"
        placeholder="Write a review (optional)"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setIsRatingOpen(false)}
          className="px-4 py-2 text-sm border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmitRating}
          className="px-4 py-2 text-sm bg-primary text-white rounded-lg"
          disabled={ratingValue === 0}
        >
          Submit Rating
        </button>
      </div>
    </div>
  </div>
)}


      
    </div>
  );
};

export default Orders;
