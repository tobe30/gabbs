import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { Package, ShoppingCart, DollarSign, Ticket } from "lucide-react";
import { getDashboard } from "../../lib/api";

const Dashboard = () => {
  const { getToken } = useAuth();

  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const token = await getToken();
      return getDashboard(token);
    },
  });

  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError || !metrics) return <p>Error loading dashboard</p>;

  return (
    <div className="w-full p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's your store overview.</p>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-3">
            ₦{metrics.totalSales.toLocaleString()}
          </div>
          {/* <p className="text-xs text-gray-500 mt-1">+12.5% from last month</p> */}
        </div>

        {/* Total Orders */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-3">{metrics.totalOrders}</div>
          {/* <p className="text-xs text-gray-500 mt-1">+8.2% from last month</p> */}
        </div>

        {/* Total Products */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-3">{metrics.totalProducts}</div>
          {/* <p className="text-xs text-gray-500 mt-1">+5 new this week</p> */}
        </div>

        {/* Active Coupons */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Active Coupons</p>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Ticket className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-3">{metrics.activeCoupons}</div>
          {/* <p className="text-xs text-gray-500 mt-1">2 expiring soon</p> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
