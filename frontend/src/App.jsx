import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Product";
import { CartProvider } from "./contexts/CartContext";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import Coupon from "./pages/admin/Coupon";
import Orders from "./pages/Orders";
import ScrollToTop from "./ScrollToTop";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";


function App() {
  const {getToken} = useAuth();
  useEffect(() => {
    getToken().then((token) => console.log(token));
  },[])

  return (
    <div>
      <ScrollToTop />
      <CartProvider>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
</Route>
        <Route element={<ProtectedRoute requireAdmin={true} />}>       
        <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<Dashboard />} />
            <Route path="product" element={<AdminProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<Coupon />} />
            <Route path="add-product" element={<AdminAddProduct />} />

         </Route>
         </Route>

      </Routes>
      </CartProvider>
      <Toaster/>
    </div>
  );
}

export default App;
