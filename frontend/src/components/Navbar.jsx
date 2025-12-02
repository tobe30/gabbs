import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { useCart } from "../contexts/CartContext"; // Import your Cart context
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { cartCount } = useCart(); // Get total items in cart

  const {user} = useUser();
  const { openSignIn } = useClerk();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/gabbs-logo.png" alt="Gabbs" className="h-20 md:h-20" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-base font-medium">
            {["Home", "Products", "Categories", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative text-gray-700 hover:text-red-600 transition-colors"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-5">
            <Link to="/products" className="hover:text-red-600 transition-colors">
              <Search className="h-5 w-5" />
            </Link>
           {user ? (
  <UserButton />
) : (
  <button
    onClick={openSignIn}
    className="hover:text-red-600 transition-colors"
  >
    <User className="h-5 w-5" />
  </button>
)}

            
            <Link to="/cart" className="relative hover:text-red-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
