import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCartApi,
  clearCartApi,
  fetchCart,
  removeFromCartApi,
  verifyCoupon,
} from "../lib/api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { getToken, isSignedIn } = useAuth();

  // --------------------------
  // GUEST CART (localStorage)
  // --------------------------
  const [guestCart, setGuestCart] = useState(() => {
    const saved = localStorage.getItem("guestCart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!isSignedIn) {
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
    }
  }, [guestCart, isSignedIn]);

  // --------------------------
  // BACKEND CART (logged in)
  // --------------------------
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const token = await getToken();
      return fetchCart(token);
    },
    enabled: isSignedIn, // 🔥 IMPORTANT
    initialData: { cart: [] },
  });

  const backendCart = data?.cart || [];

  // --------------------------
  // CART SOURCE SWITCH
  // --------------------------
  const cartItems = isSignedIn ? backendCart : guestCart;

  // --------------------------
  // MUTATIONS
  // --------------------------
  const addToCartMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      return addToCartApi(payload, token);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId) => {
      const token = await getToken();
      return removeFromCartApi({ productId }, token);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return clearCartApi(token);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // --------------------------
  // ADD TO CART
  // --------------------------
  const addToCart = (product) => {
    if (!isSignedIn) {
      // 👤 GUEST
      setGuestCart((prev) => {
        const existing = prev.find(
          (i) => i.productId === product._id
        );

        if (existing) {
          return prev.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "/placeholder.png",
            quantity: 1,
          },
        ];
      });
      return;
    }

    // 🔐 LOGGED IN
    addToCartMutation.mutate({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.png",
      quantity: 1,
    });
  };

  // --------------------------
  // DECREMENT
  // --------------------------
  const decrementFromCart = (payload) => {
    if (!isSignedIn) {
      setGuestCart((prev) =>
        prev
          .map((item) =>
            item.productId === (payload.productId || payload._id)
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
      return;
    }

    addToCartMutation.mutate({
      productId: payload.productId || payload._id,
      quantity: -1,
    });
  };

  // --------------------------
  // REMOVE ITEM
  // --------------------------
  const removeFromCart = (productId) => {
    if (!isSignedIn) {
      setGuestCart((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      return;
    }

    removeFromCartMutation.mutate(productId);
  };

  // --------------------------
  // CLEAR CART
  // --------------------------
  const clearCart = () => {
    if (!isSignedIn) {
      setGuestCart([]);
      localStorage.removeItem("guestCart");
      return;
    }

    clearCartMutation.mutate();
  };

  // --------------------------
  // MERGE CART ON LOGIN
  // --------------------------
  useEffect(() => {
    if (isSignedIn && guestCart.length > 0) {
     guestCart.forEach((item) => {
  addToCartMutation.mutate({
    productId: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  });
});


      setGuestCart([]);
      localStorage.removeItem("guestCart");
    }
  }, [isSignedIn]);

  // --------------------------
  // COUPON
  // --------------------------
  const verifyCouponMutation = useMutation({
    mutationFn: async (code) => {
      const token = await getToken();
      return verifyCoupon(code, token);
    },
  });

  const applyCoupon = async (code) => {
    try {
      const coupon = await verifyCouponMutation.mutateAsync(code);

      if (!coupon?.valid) {
        return {
          success: false,
          discount: 0,
          message: "Invalid coupon ❌",
        };
      }

      return {
        success: true,
        discount: Number(coupon.discount),
        message: coupon.message,
      };
    } catch {
      return {
        success: false,
        discount: 0,
        message: "Invalid coupon ❌",
      };
    }
  };

  // --------------------------
  // CONTEXT VALUE
  // --------------------------
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.reduce((a, c) => a + c.quantity, 0),
        addToCart,
        decrementFromCart,
        removeFromCart,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
