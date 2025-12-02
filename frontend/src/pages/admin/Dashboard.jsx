import { Package, ShoppingCart, DollarSign, Ticket } from "lucide-react";

const Dashboard = () => {

  const metrics = {
    totalSales: 45230.50,
    totalOrders: 324,
    totalProducts: 156,
    activeCoupons: 12,
  };

  return (
    <div className="w-full p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back! Here's your store overview.
        </p>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* CARD 1 */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-3">
            ${metrics.totalSales.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">+12.5% from last month</p>
        </div>

        {/* CARD 2 */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-3">{metrics.totalOrders}</div>
          <p className="text-xs text-gray-500 mt-1">+8.2% from last month</p>
        </div>

        {/* CARD 3 */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-3">{metrics.totalProducts}</div>
          <p className="text-xs text-gray-500 mt-1">+5 new this week</p>
        </div>

        {/* CARD 4 */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Active Coupons</p>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Ticket className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-3">{metrics.activeCoupons}</div>
          <p className="text-xs text-gray-500 mt-1">2 expiring soon</p>
        </div>

      </div>

      {/* LOWER CARDS */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {/* RECENT ORDERS */}
       <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl p-6 border border-gray-100">
  {/* Title */}
  <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
    <span className="block w-1.5 h-6 bg-primary rounded-full"></span>
    Recent Orders
  </h2>

  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center justify-between pb-4 border-b border-gray-300 last:border-none group"
      >
        {/* LEFT */}
        <div>
          <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
            Order #{1000 + i}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">Customer Name</p>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <p className="font-semibold text-gray-800">
            ${(Math.random() * 200 + 50).toFixed(2)}
          </p>
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-primary rounded-full border border-blue-100">
            Pending
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* Footer Button */}
  <div className="mt-5 flex justify-center">
    <button className="text-sm font-medium text-primary hover:text-blue-700 hover:underline">
      View All Orders →
    </button>
  </div>
</div>

        {/* LOW STOCK */}
        <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl p-6 border border-gray-100">
  {/* Title */}
  <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
    <span className="block w-1.5 h-6 bg-primary rounded-full"></span>
    Low Stock Products
  </h2>

  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center justify-between pb-4 border-b border-gray-300 last:border-none group"
      >
        {/* LEFT */}
        <div>
          <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
            Product Name {i}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">Electronics</p>
        </div>

        {/* RIGHT */}
        <div>
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-primary rounded-full border border-blue-200">
            {Math.floor(Math.random() * 5 + 1)} left
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* Footer Button */}
  <div className="mt-5 flex justify-center">
    <button className="text-sm font-medium text-primary hover:text-blue-700 hover:underline">
      View Inventory →
    </button>
  </div>
</div>


      </div>
    </div>
  );
};

export default Dashboard;
