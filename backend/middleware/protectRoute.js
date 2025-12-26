import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const userId = req.auth.userId; // Clerk ID
    const user = await User.findById(userId);

    if (!user) return res.json({ success: false, message: 'User not found' });

    if (user.role !== 'admin') {
      return res.json({ success: false, message: 'Unauthorized Access' });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
