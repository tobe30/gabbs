import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // reference to User ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Only createdAt
);

// Optional: Virtual for orders related to this address (not stored in DB)
addressSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "addressId",
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
