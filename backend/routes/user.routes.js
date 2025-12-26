import express from "express";
import { getUserData } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/data', getUserData);

// Route to get currently logged-in user
router.get("/check", protectRoute, (req, res)=>{
    res.status(200).json({ success: true, user: req.user});
})

export default router;