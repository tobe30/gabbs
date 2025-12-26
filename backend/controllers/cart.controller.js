import User from "../models/User.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { productId, name, price, image, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find product in cart
    const existingItem = user.cart.find((item) => item.productId === productId);

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;

      // Remove item if quantity goes to 0
      if (existingItem.quantity <= 0) {
        user.cart = user.cart.filter((item) => item.productId !== productId);
      }
    } else {
      // Add new item
      user.cart.push({
        productId,
        name,
        price,
        image,
        quantity,
      });
    }

    await user.save();

    return res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


//Get user cart
export const getCart = async (req, res) => {
    try {
        const userId = req.auth.userId;// 
        
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized Access" });
    }
        
        const user = await User.findById(userId);

         if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        console.error(error);
         return res.status(400).json({ error: error.message });
    }
}

export const clearCart = async (req, res) => {
  try {
    const userId = req.auth.userId; // Clerk user ID

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized Access" });
    }

    // Set cart to empty object
    await User.findByIdAndUpdate(
      userId,
      { cart: [] },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Cart cleared successfully", cart: [] });


  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { productId } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized Access" });
    if (!productId)
      return res.status(400).json({ success: false, message: "Product ID is required" });

    const result = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { productId: productId } } }, // Removes the matching item
      { new: true } // Returns the updated document
    );

    if (!result)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: result.cart,
    });
  } catch (error) {
    console.error("Remove item error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

