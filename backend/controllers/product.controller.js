import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    // Parse productData JSON string from form-data
    const { productData } = req.body;
    if (!productData) {
      return res.status(400).json({ message: "Product data is required." });
    }

    const { name, description, mrp, price, category, inStock } = JSON.parse(productData);

    const files = req.files; // multer array

    if (!name || !mrp || !price || !category || !files || files.length === 0) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // Upload all images to Cloudinary in parallel
    const imageUrls = await Promise.all(
      files.map(file => cloudinary.uploader.upload(file.path).then(result => result.secure_url))
    );

    const newProduct = new Product({
      name,
      description,
      mrp,
      price,
      category,
      inStock: inStock ?? true,
      images: imageUrls
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// GET /api/admin/products
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

