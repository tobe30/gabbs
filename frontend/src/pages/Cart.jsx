import { Link } from "react-router-dom";

import { useCart } from "../contexts/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, decrementFromCart,  addToCart} = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
       
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to get started</p>
          <Link to="/products">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
              Browse Products
            </button>
          </Link>
        </div>
       
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-card rounded-xl border border-border p-4 flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-primary font-bold text-xl">₦{item.price.toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    key={item.productId}
                    onClick={() => removeFromCart(item.productId)}

                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2 bg-primary text-white rounded-lg p-1">
                    <button
                       onClick={() => decrementFromCart(item)}
                      className="p-1 hover:bg-background rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        addToCart({
                          _id: item.productId,
                          name: item.name,
                          price: item.price,
                          images: [item.image],
                        })
                      }

                      className="p-1 hover:bg-background rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-card rounded-xl border border-border p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₦{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full mb-3 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
                  Proceed to Checkout
                </button>
              </Link>

              <Link to="/products">
                <button className="w-full px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Cart;
