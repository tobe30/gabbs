import express from "express";
import { addProduct, getAdminProducts, getAllProducts, getProducts } from "../controllers/product.controller.js";
import upload from "../lib/multer.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

//product routes

router.get("/all", getAllProducts),
router.get("/:id", getProducts)
router.use(protectRoute); // Protect all routes below this middleware

router.post("/add-product", upload.array('images', 5), addProduct)
router.get("/", getAdminProducts)


export default router;