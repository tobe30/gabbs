import { Calendar, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Footer from '../components/admin/Footer';

const Layout = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 bg-[#F4F7FB]">

        {/* NAVBAR */}
        <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200 bg-white">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/gabbs-logo.png" alt="Gabbs" className="h-16 md:h-20" />
          </Link>

          {/* Right side: Profile + Toggle */}
          <div className="flex items-center gap-5">

            {/* Profile */}
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="/avatar.png"
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <span className="font-medium text-gray-700 hidden sm:block">
                Admin
              </span>
            </div>

            {/* Menu Toggle for Mobile */}
            {sidebar ? (
              <X
                onClick={() => setSidebar(false)}
                className="w-6 h-6 text-gray-600 sm:hidden"
              />
            ) : (
              <Menu
                onClick={() => setSidebar(true)}
                className="w-6 h-6 text-gray-600 sm:hidden"
              />
            )}
          </div>
        </nav>

        {/* Page Content Scrollable */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>

        {/* Footer stays at bottom of right side only */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
