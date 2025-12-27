import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const userId = req.auth.userId; // Clerk ID
    const user = await User.findById(userId);

    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized Access' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
