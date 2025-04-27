import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";

const Navbar: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 w-full">
      {/* Top Header */}
      <div className="px-4 py-2 flex justify-between items-center border-b dark:border-gray-700">
        <Header />
      </div>

      {/* Navigation Links */}
      <div className="px-4 py-2">
        <Navigation />
      </div>
    </header>
  );
};

export default Navbar;
