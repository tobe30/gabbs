import Rating from "../models/Rating.js";
import Order from "../models/Order.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

// Add a new rating
export const addRating = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Not authorized" });
    
    const { orderId, productId, rating, review } = req.body;


    if (!orderId || !productId || !rating)
      return res.status(400).json({ error: "Missing required fields" });

    // Check if order exists and belongs to the user
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Check if product already rated in this order
    const isAlreadyRated = await Rating.findOne({ productId, orderId });
    if (isAlreadyRated)
      return res.status(400).json({ error: "Product already rated" });

    const newRating = await Rating.create({
      userId,
      productId,
      orderId,
      rating,
      review,
    });

    return res
      .status(201)
      .json({ message: "Rating added successfully", rating: newRating });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// Get all ratings for a user
export const getUserRatings = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const ratings = await Rating.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ ratings });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.find({ productId }).sort({ createdAt: -1 });

    // Fetch user names from Clerk
    const ratingsWithUser = await Promise.all(
      ratings.map(async (r) => {
        let userName = "Anonymous";
        try {
          const user = await clerkClient.users.getUser(r.userId);
          userName = user.firstName || user.email || "Anonymous";
        } catch (err) {
          console.log("Clerk user fetch failed:", r.userId);
        }
        return {
          ...r.toObject(),
          userName,
        };
      })
    );

    const count = ratings.length;
    const average =
      count === 0
        ? 0
        : Number((ratings.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1));

    res.json({
      average,
      count,
      ratings: ratingsWithUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

