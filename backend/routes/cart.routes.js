import express from "express";
import { addToCart, clearCart, getCart, removeItemFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

//cart routes



router.post("/update", addToCart);
router.get("/", getCart)
router.post("/clear", clearCart)
router.delete("/remove", removeItemFromCart);

export default router;