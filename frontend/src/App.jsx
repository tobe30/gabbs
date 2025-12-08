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
import Layout from "./pages/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import Coupon from "./pages/admin/Coupon";
import Orders from "./pages/Orders";
import ScrollToTop from "./ScrollToTop";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";


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
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path="product" element={<AdminProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<Coupon />} />
         </Route>
        
        {/* <Route
            path="/admin"
            element={
              <ProtectedAdminRoute isAdmin={true}>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="coupons" element={<CouponsAdmin />} />
          </Route> */}

      </Routes>
      </CartProvider>
    </div>
  );
}

export default App;
