import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

export const getDashboardData = async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total sales / revenue (sum of all order totals)
    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

    // Total products
    const totalProducts = await Product.countDocuments();

    // Active coupons (not expired)
    const now = new Date();
    const activeCoupons = await Coupon.countDocuments({
      expiresAt: { $gte: now },
    });

    return res.status(200).json({
      totalOrders,
      totalSales,
      totalProducts,
      activeCoupons,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ error: error.message });
  }
};
