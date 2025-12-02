import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // --------------------------
  // ADD TO CART
  // --------------------------
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // --------------------------
  // REMOVE OR DECREMENT
  // --------------------------
  const removeFromCart = (productId, decrement = false) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            if (decrement) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return null; // remove completely
            }
          }
          return item;
        })
        .filter((item) => item && item.quantity > 0)
    );
  };

  // --------------------------
  // MANUALLY UPDATE QUANTITY
  // --------------------------
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // --------------------------
  // CLEAR CART
  // --------------------------
  const clearCart = () => setCartItems([]);

  // --------------------------
  // CART COUNT
  // --------------------------
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --------------------------
  // COUPON SYSTEM (NEW)
  // --------------------------
  const validCoupons = {
    WELCOME10: 0.10,
    SAVE20: 0.20,
    MEGA30: 0.30,
  };

  const applyCoupon = (code) => {
    const coupon = code.toUpperCase().trim();

    if (validCoupons[coupon]) {
      return {
        success: true,
        discount: validCoupons[coupon],
        message: `Coupon applied! You saved ${validCoupons[coupon] * 100}% 🎉`,
      };
    }

    return {
      success: false,
      discount: 0,
      message: "Invalid coupon code ❌",
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        applyCoupon, // <-- MAKE SURE THIS IS EXPORTED
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
