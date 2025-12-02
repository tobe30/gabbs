import { Eye } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [orders, setOrders] = useState([
    {
      id: 1001,
      customer: "John Doe",
      email: "john@example.com",
      total: 149.99,
      status: "pending",
      date: "2024-03-15",
      items: [
        { name: "Product A", quantity: 1, price: 99.99 },
        { name: "Product B", quantity: 2, price: 25.0 },
      ],
      shippingAddress: "123 Main St, City, Country",
    },
    {
      id: 1002,
      customer: "Jane Smith",
      email: "jane@example.com",
      total: 299.99,
      status: "shipped",
      date: "2024-03-14",
      items: [{ name: "Product C", quantity: 1, price: 299.99 }],
      shippingAddress: "456 Oak Ave, Town, Country",
    },
    {
      id: 1003,
      customer: "Bob Johnson",
      email: "bob@example.com",
      total: 89.99,
      status: "delivered",
      date: "2024-03-13",
      items: [{ name: "Product D", quantity: 1, price: 89.99 }],
      shippingAddress: "789 Pine Rd, Village, Country",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );

    toast.success(`Order #${id} status changed to ${newStatus}.`);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50">
      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <p className="text-gray-500">View and manage customer orders.</p>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className=" border-gray-500 bg-gray-100 text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Change Status</th>
              <th className="p-3 text-right">Details</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-semibold">#{order.id}</td>

                <td className="p-3">
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.email}</p>
                </td>

                <td className="p-3">{order.date}</td>

                <td className="p-3">${order.total.toFixed(2)}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1  rounded-full text-xs font-medium capitalize
                    ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="p-3 text-right">
                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="text-primary hover:underline text-sm"
                  >
               <Eye className="w-5 h-5" />

                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Order Details — #{selectedOrder.id}
              </h2>
              <button
                className="text-red-600 hover:text-black"
                onClick={() => setIsViewOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* DETAILS */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p className="text-sm"><b>Name:</b> {selectedOrder.customer}</p>
                  <p className="text-sm"><b>Email:</b> {selectedOrder.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <p className="text-sm"><b>Date:</b> {selectedOrder.date}</p>
                  <p className="text-sm"><b>Status:</b> {selectedOrder.status}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>

                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="p-2 text-right">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}

                    <tr className="border-t border-gray-200 font-semibold">
                      <td colSpan={3} className="p-2 text-right">
                        Total:
                      </td>
                      <td className="p-2 text-right">
                        ${selectedOrder.total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CLOSE BUTTON */}
              <div className="text-right">
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminOrders;
