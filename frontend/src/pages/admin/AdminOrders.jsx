import { Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getOrders, updateOrderStatus } from "../../lib/api";

const AdminOrders = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Fetch orders
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const token = await getToken();
      return getOrders(token);
    },
  });

  const orders = data?.orders || [];

  // Mutation to update status and isPaid
 const mutation = useMutation({
  mutationFn: async ({ id, status, isPaid }) => {
    const token = await getToken();
    return updateOrderStatus(id, status, isPaid, token);
  },
  onSuccess: (_, { id, status, isPaid }) => {
    toast.success(`Order #${id} updated to ${status}`);
    // Update cache manually
    queryClient.setQueryData(["orders"], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        orders: oldData.orders.map((order) =>
          order._id === id ? { ...order, status, isPaid } : order
        ),
      };
    });
  },
  onError: () => {
    toast.error("Failed to update order status.");
  },
});


  const handleStatusChange = (order, newStatus, newIsPaid) => {
    mutation.mutate({ id: order._id, status: newStatus, isPaid: newIsPaid });
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  if (isLoading) return <p className="p-6 text-center">Loading orders...</p>;
  if (isError) return <p className="p-6 text-center text-red-500">Failed to load orders.</p>;

  return (
   <div className="w-full min-h-screen p-4 sm:p-6 bg-gray-50 overflow-x-hidden">
  <div className="mb-6">
    <h1 className="text-2xl sm:text-3xl font-bold">Manage Orders</h1>
    <p className="text-gray-500 text-sm sm:text-base">View and manage customer orders.</p>
  </div>

  {/* Table Container */}
  <div className="bg-white p-2 sm:p-6 rounded-xl shadow-sm border border-gray-200 -mx-4 sm:mx-0 overflow-x-auto min-w-0">
    <table className="w-full table-auto border-collapse border border-gray-300 min-w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border border-gray-300 text-left text-xs sm:text-sm">Username</th>
          <th className="p-2 border border-gray-300 text-left text-xs sm:text-sm">Total</th>
          <th className="p-2 border border-gray-300 text-left text-xs sm:text-sm">Status</th>
          <th className="p-2 border border-gray-300 text-left text-xs sm:text-sm">Paid?</th>
          <th className="p-2 border border-gray-300 text-left text-xs sm:text-sm">Change Status</th>
          <th className="p-2 border border-gray-300 text-right text-xs sm:text-sm">Details</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-2 border border-gray-300 text-xs sm:text-sm">{order.userId?.name || order.userId}</td>
            <td className="p-2 border border-gray-300 text-xs sm:text-sm">${order.total?.toFixed(2)}</td>
            <td className="p-2 border border-gray-300 text-xs sm:text-sm">{order.status}</td>
            <td className="p-2 border border-gray-300 text-xs sm:text-sm">{order.isPaid ? "Yes" : "No"}</td>
            <td className="p-2 border border-gray-300">
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order, e.target.value, order.isPaid)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm w-full sm:w-auto bg-white hover:border-gray-400"
                >
                  <option value="ORDER_PLACED">ORDER_PLACED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <select
                  value={order.isPaid ? "true" : "false"}
                  onChange={(e) => handleStatusChange(order, order.status, e.target.value === "true")}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm w-full sm:w-auto bg-white hover:border-gray-400"
                >
                  <option value="true">Paid</option>
                  <option value="false">Unpaid</option>
                </select>
              </div>
            </td>
            <td className="p-2 border border-gray-300 text-right">
              <button
                onClick={() => viewOrderDetails(order)}
                className="text-primary hover:underline text-sm sm:text-base"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* VIEW MODAL */}
  {isViewOpen && selectedOrder && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-x-hidden">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg sm:max-w-3xl p-4 sm:p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Order Details — #{selectedOrder._id}</h2>
          <button
            className="text-red-600 hover:text-black"
            onClick={() => setIsViewOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 sm:space-y-4 text-xs sm:text-sm">
          <p><b>Username:</b> {selectedOrder.userId?.name || "Unknown"}</p>
          <p><b>Total:</b> ${selectedOrder.total?.toFixed(2)}</p>
          <p><b>Status:</b> {selectedOrder.status}</p>
          <p><b>Paid:</b> {selectedOrder.isPaid ? "Yes" : "No"}</p>
          <p><b>Payment Method:</b> {selectedOrder.paymentMethod}</p>
          <p><b>Address ID:</b> {selectedOrder.addressId}</p>

          <h3 className="font-semibold mt-2 sm:mt-4">Order Items:</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 min-w-[500px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-1 sm:p-2 border border-gray-300 text-left">Product</th>
                  <th className="p-1 sm:p-2 border border-gray-300 text-center">Qty</th>
                  <th className="p-1 sm:p-2 border border-gray-300 text-right">Price</th>
                  <th className="p-1 sm:p-2 border border-gray-300 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-1 sm:p-2 border border-gray-300">{item.productId?.name || "Unknown"}</td>
                    <td className="p-1 sm:p-2 border border-gray-300 text-center">{item.quantity}</td>
                    <td className="p-1 sm:p-2 border border-gray-300 text-right">${item.price.toFixed(2)}</td>
                    <td className="p-1 sm:p-2 border border-gray-300 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right mt-2 sm:mt-4">
            <button
              onClick={() => setIsViewOpen(false)}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-primary text-white rounded-lg hover:bg-black"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>


  );
};

export default AdminOrders;
