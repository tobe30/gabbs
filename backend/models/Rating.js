import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true }, // rating value
    review: { type: String, required: true }, // review text
    userId: { type: String, required: true }, // reference to user
    productId: { type: String, required: true }, // reference to product
    orderId: { type: String, required: true }, // reference to order
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Ensure a user can only rate a product once per order
ratingSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
