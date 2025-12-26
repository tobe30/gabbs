import Coupon from "../models/Coupon.js";
import cron from "node-cron";

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const  coupon  = req.body; //


    if (!coupon || !coupon.code) 
      return res.status(400).json({ message: "Invalid coupon data" });

    // Make code uppercase
    coupon.code = coupon.code.toUpperCase();

    // Check if coupon already exists
    const exists = await Coupon.findOne({ code: coupon.code });
    if (exists) 
      return res.status(409).json({ message: "Coupon code already exists" });

    // Save the new coupon
    const newCoupon = await Coupon.create(coupon);

    res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Cron job to delete expired coupons
cron.schedule("* * * * *", async () => { // runs every minute
  try {
    const now = new Date();
    const expiredCoupons = await Coupon.find({ expiresAt: { $lte: now } });

    if (expiredCoupons.length > 0) {
      const codes = expiredCoupons.map(c => c.code);
      await Coupon.deleteMany({ expiresAt: { $lte: now } });
      console.log(`Deleted expired coupons: ${codes.join(", ")}`);
    }
  } catch (err) {
    console.error("Error deleting expired coupons:", err);
  }
});


// Delete Coupon by code (query param: ?code=XXXX)
export const deleteCoupon = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const deleted = await Coupon.findOneAndDelete({ code: code.toUpperCase() });
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });

    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json({ coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};



export const verifyCoupon = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Not authorized" });

    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });

    if (coupon.expiresAt <= new Date())
      return res.status(400).json({ message: "Coupon has expired" });

    res.json({
      valid: true,
      discount: coupon.discount / 100,
      message: `Coupon applied! ${coupon.discount}% off`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
