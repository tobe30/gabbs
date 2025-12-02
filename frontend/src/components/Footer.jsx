import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/gabbs-logo.png" alt="Gabbs" className="h-10 mb-4" />
            <p className="text-sm opacity-90">
              Your trusted platform for quality products and seamless shopping experience.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="opacity-90 hover:opacity-100 transition-opacity">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="opacity-90 hover:opacity-100 transition-opacity">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/post-product" className="opacity-90 hover:opacity-100 transition-opacity">
                  Post Product
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="opacity-90 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="opacity-90 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="opacity-90 hover:opacity-100 transition-opacity">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="opacity-90 hover:opacity-100 transition-opacity">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Gabbs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
