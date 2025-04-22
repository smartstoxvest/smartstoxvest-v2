import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

const Navbar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <Header />
      <Navigation />
    </div>
  );
};

export default Navbar;
