import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCartApi, clearCartApi, fetchCart, removeFromCartApi, verifyCoupon } from "../lib/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
const { data } = useQuery({
  queryKey: ["cart"],
  queryFn: async () => {
    const token = await getToken();
    return fetchCart(token);
  },
  initialData: { cart: [] },
});


   const cartItems = data?.cart || [];


  // --------------------------
  // ADD TO CART
  // --------------------------
const addToCartMutation = useMutation({
  mutationFn: async (product) => {
    const token = await getToken();
    return addToCartApi(product, token);
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
});

const removeFromCartMutation = useMutation({
  mutationFn: async (productId) => {
    const token = await getToken();
    return removeFromCartApi({ productId }, token);
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
});

const clearCartMutation = useMutation({
  mutationFn: async () => {
    const token = await getToken();
    return clearCartApi(token);
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
});

const decrementFromCartMutation = useMutation({
  mutationFn: async (payload) => {
    const token = await getToken();

    // 🔥 NORMALIZE INPUT
    const productId =
      payload.productId || payload._id; // cart page || product page

    return addToCartApi(
      {
        productId,
        name: payload.name,
        price: payload.price,
        image:
          payload.image ||
          payload.images?.[0] ||
          "/placeholder.png",
        quantity: -1,
      },
      token
    );
  },
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] }),
});

//   const decrementFromCartMutation = useMutation({
//   mutationFn: async (product) => {
//     const token = await getToken();
//     return addToCartApi(
//       {
//         productId: product._id,
//         name: product.name,
//         price: product.price,
//         image: product.images?.[0] ?? "",
//         quantity: -1, // 👈 THIS is the magic
//       },
//       token
//     );
//   },
//   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
// });

// const decrementFromCartMutation = useMutation({
//   mutationFn: async (item) => {
//     const token = await getToken();
//     return addToCartApi(
//       {
//         productId: item.productId, // ✅ CORRECT
//         name: item.name,
//         price: item.price,
//         image: item.image ?? "",
//         quantity: -1,
//       },
//       token
//     );
//   },
//   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
// });

  // --------------------------
  // COUPON SYSTEM (NEW)
  // --------------------------

  const verifyCouponMutation = useMutation({
    mutationFn: async (code) => {
      const token = await getToken();
      return verifyCoupon(code, token);
    },
  });



  // const validCoupons = {
  //   WELCOME10: 0.05,
  //   SAVE20: 0.20,
  //   MEGA30: 0.30,
  // };

  const applyCoupon = async (code) => {
  try {
    const coupon = await verifyCouponMutation.mutateAsync(code);
    console.log("Coupon response:", coupon);
    

    if (!coupon?.valid) { // <-- check valid
      return {
        success: false,
        discount: 0,
        message: "Invalid coupon code ❌",
      };
    }

    return {
      success: true,
      discount: Number(coupon.discount) || 0,
      message: coupon.message || `Coupon applied! ${Number(coupon.discount) * 100}% off`,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      discount: 0,
      message: err.response?.data?.message || "Invalid coupon code ❌",
    };
  }
};




  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart: (product) => addToCartMutation.mutate({ 
          productId: product._id, 
          name: product.name, 
          price: product.price, 
          image: product.images[0] || "/placeholder.png", 
          quantity: 1 
        }),
        removeFromCart: (productId) => removeFromCartMutation.mutate(productId),
        clearCart: () => clearCartMutation.mutate(),
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        decrementFromCart: (product) => decrementFromCartMutation.mutate(product),

        applyCoupon, // <-- MAKE SURE THIS IS EXPORTED
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
