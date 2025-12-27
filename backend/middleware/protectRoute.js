import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  console.log("req.auth:", req.auth); // 🔥 Check if userId exists
  const userId = req.auth?.userId;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'No userId from Clerk - likely session cookie not sent',
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized Access' });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

