import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import Rating from "../models/Rating.js";

export const addProduct = async (req, res) => {
  try {
    // Parse productData JSON string from form-data
    console.log("FILES:", req.files?.length);
    console.log("BODY:", req.body);
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



// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query; // optional filter

    let query = {};
    if (category) query.category = category;

    // Fetch products
    const products = await Product.find(query).sort({ createdAt: -1 });

    // Add rating stats for each product
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const ratings = await Rating.find({ productId: product._id });

        const count = ratings.length;
        const average =
          count === 0
            ? 0
            : Number(
                (ratings.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
              );

        return {
          ...product.toObject(),
          ratingStats: { average, count },
        };
      })
    );

    res.status(200).json({
      message: "Products fetched successfully",
      products: productsWithRatings,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};



export const getProducts = async (req, res) => {
  try {
    const {id} = req.params

    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
}



