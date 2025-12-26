import express from "express";
import { createCoupon, deleteCoupon, getCoupons, verifyCoupon } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
//coupon routes


router.post("/verify", verifyCoupon);
router.use(protectRoute); // Protect all routes below this middleware

router.post("/add-coupon", createCoupon);
router.delete("/delete", deleteCoupon);
router.get("/", getCoupons);

export default router;