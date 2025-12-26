import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false }); // prevent auto _id for each orderItem

const orderSchema = new mongoose.Schema({
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["ORDER_PLACED","SHIPPED", "COMPLETED", "CANCELLED"],
    default: "ORDER_PLACED"
  },
  userId: { type: String, ref: "User", required: true }, // store Clerk ID as string
  
  addressId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Address",
  required: true
},

  isPaid: { type: Boolean, default: false },
  paymentMethod: {
    type: String,
    enum: ["COD", "STRIPE"],
    required: true
  },
  isCouponUsed: { type: Boolean, default: false },
  coupon: { type: Object, default: {} },
  orderItems: [orderItemSchema]
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
