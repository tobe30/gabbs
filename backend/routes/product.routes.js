import express from "express";
import { addProduct } from "../controllers/product.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();

//product routes
router.post("/add-product", upload.array('images', 5), addProduct)

export default router;