import { House, LayoutListIcon, LogOut, SquarePenIcon, TicketPercentIcon } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "", label: "Dashboard", Icon: House },
  { to: "/admin/product", label: "Add Product", Icon: SquarePenIcon },
  { to: "/admin/orders", label: "Orders", Icon: LayoutListIcon },
  { to: "/admin/coupons", label: "coupons", Icon: TicketPercentIcon },

];

const Sidebar = ({ sidebar, setSidebar }) => {
  // Fake frontend-only username
  const fakeAdminUser = {
    username: "Admin User",
  };

  const handleLogout = () => {
    // Frontend only — just redirect or clear localStorage
    console.log("Logged out");
    window.location.href = "/";
  };

  return (
    <div
      className={`
        w-60 bg-white border-r border-gray-200 flex flex-col justify-between 
        items-center max-sm:absolute top-14 bottom-0 
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} 
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="my-7 w-full">
        <img
          src="/gehgeh.jpeg"
          alt="user avatar"
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="mt-1 text-center">{fakeAdminUser.username}</h1>

        <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded ${
                  isActive ? "bg-primary text-white" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-white" : ""}`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
