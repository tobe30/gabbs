import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,   
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,   
      required: true,
    },
    forNewUser: {
      type: Boolean,
      required: true,
    },
    forMember: {
      type: Boolean,
      default: false, 
    },
   
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
