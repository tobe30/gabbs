import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Stripe from "stripe"

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Not authorized" });

    const { addressId, items, couponCode, paymentMethod } = req.body;

    if (!addressId || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing order details" });
    }

    let coupon = null;

    // Fetch coupon if provided
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon) return res.status(400).json({ error: "Coupon not found or expired" });
    }

    // Check coupon validity for new users
    if (coupon && coupon.forNewUser) {
      const userOrders = await Order.find({ userId });
      if (userOrders.length > 0) {
        return res.status(400).json({ error: "Coupon valid for new users only" });
      }
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) return res.status(404).json({ error: `Product ${item.id} not found` });

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name, // Needed for Stripe line_items
      });

      total += product.price * item.quantity;
    }

    // Apply coupon discount
    if (coupon) {
      total -= (total * coupon.discount) / 100;
    }

    // Add shipping fee once
    total += 5; 

    const order = new Order({
      userId,
      addressId,
      total: parseFloat(total.toFixed(2)),
      paymentMethod,
      isCouponUsed: coupon ? true : false,
      coupon: coupon ? coupon : {},
      orderItems,
    });

    await order.save();

    if (paymentMethod === "STRIPE") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const origin = req.headers.origin || "http://localhost:3000";

      const line_items = orderItems.map(item => ({
        price_data: {
          currency: "ngn",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${origin}/orders?success=true`,
        cancel_url: `${origin}/cart`,
        metadata: {
          orderId: order._id.toString(),
          userId,
          appId: "gabbs",
        },
      });

      return res.status(200).json({ session });
    }


    // Clear the user's cart
    const user = await User.findById(userId);
    if (user) {
      user.cart = [];
      await user.save();
    }

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      total: order.total,
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Not authorized" });

    const orders = await Order.find({ userId })
      .populate("orderItems.productId") // populate product details
      .populate("addressId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


// Update order status by admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, isPaid } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }

    const validStatuses = ["ORDER_PLACED", "SHIPPED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    
    if (typeof isPaid === "boolean") order.isPaid = isPaid;
    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};




// Get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("orderItems.productId", "name") // populate product details
      .populate("userId", "name")
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
