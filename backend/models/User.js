import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk user ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    cart: [
      {
        productId: { type: String, required: true },
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);

export default User;
