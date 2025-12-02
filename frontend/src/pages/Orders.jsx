import React, { useState } from "react";
import { Package, MapPin, Calendar, DollarSign, Eye, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster, toast } from "react-hot-toast";

const Orders = () => {
  // mock orders in state so we can update / interact
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      date: "2024-11-25",
      total: 729.97,
      status: "delivered",
      items: [
        {
          name: "Premium Wireless Headphones",
          quantity: 1,
          price: 299.99,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        },
        {
          name: "Smart Watch Pro",
          quantity: 1,
          price: 399.99,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        },
        {
          name: "Stainless Steel Water Bottle",
          quantity: 1,
          price: 29.99,
          image:
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "123 Main St, City, State 12345",
      paymentMethod: "Credit Card",
    },
    {
      id: "ORD-002",
      date: "2024-11-20",
      total: 159.99,
      status: "shipped",
      items: [
        {
          name: "Leather Messenger Bag",
          quantity: 1,
          price: 159.99,
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "456 Oak Ave, Town, State 67890",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "ORD-003",
      date: "2024-11-15",
      total: 449.99,
      status: "pending",
      items: [
        {
          name: "Ergonomic Office Chair",
          quantity: 1,
          price: 449.99,
          image:
            "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop",
        },
      ],
      shippingAddress: "789 Pine Rd, Village, State 11223",
      paymentMethod: "Credit Card",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


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

  const handleChangeStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order ${orderId} status updated to "${newStatus}"`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
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
                          • {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-gray-400" />
                          <span className="truncate max-w-xs">{order.shippingAddress}</span>
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

                    <div className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</div>

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
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 min-w-[220px]">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 4 && (
                      <div className="flex items-center text-sm text-gray-500">
                        +{order.items.length - 4} more item(s)
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
                <h3 className="text-lg font-semibold">Order Details — #{selectedOrder.id}</h3>
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
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md border border-gray-300" />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold mb-2">Payment Method</h4>
                <p className="text-gray-700">{selectedOrder.paymentMethod}</p>
              </div>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</div>
              </div>

              
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Orders;
